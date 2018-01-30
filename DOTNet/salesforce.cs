static void Main(string[] args)
        {
            Odi.Common.Config.Util commonConfigUtil = new Odi.Common.Config.Util();
            String connectionString = commonConfigUtil.GetDatabaseConnectionString();

            using (SqlConnection cnn = new SqlConnection(connectionString))
            {
                try
                {
                    OrderItem orderItem;

                    DateTime dt = DateTime.ParseExact(ConfigurationManager.AppSettings["StartDate"], "yyyy-MM-dd", null);

                    String commandSelect = "Query here to get table(s) rows";
                    SqlCommand cmd = new SqlCommand(commandSelect, cnn);
                    cmd.Parameters.AddWithValue("@startDate", dt);
                    //order item params
                    cmd.Parameters.AddWithValue("@orderItemId", SqlDbType.VarChar);
                    cmd.Parameters.AddWithValue("@oncorpItemId", SqlDbType.VarChar);
                    //invoice params
                    cmd.Parameters.AddWithValue("@orderId", SqlDbType.VarChar);
                    cmd.Parameters.AddWithValue("@oncorpInvoiceId", SqlDbType.VarChar);
                    cnn.Open();

                    SqlDataReader readerItem = cmd.ExecuteReader();

                    var SfClient = readerItem.HasRows ? ConnectToSalesforce().Result : null;  // initialize salesforce client connection, if there are items to add

                    DataTable dataTable = new DataTable();
                    dataTable.Load(readerItem);
                    readerItem.Close();

                    //Add order items to open orders
                    foreach (DataRow row in dataTable.AsEnumerable())
                    {
                        var account = SfGetAccount(SfClient, row["ClientID"].ToString());

                        var recordType = SfGetRecordType(SfClient, "Order");

                        var products = recordType == null ? null : SfClient.QueryAsync<Product>("SELECT id FROM Product2 WHERE ProductCode = '" + row["purchased_product_id"].ToString() + "' AND Family = 'Oncorp'").Result;
                        var product = products == null ? null : products.Records.FirstOrDefault();

                        var pricebookEntries = product == null ? null : SfClient.QueryAsync<PricebookEntry>("SELECT id, Pricebook2Id FROM PricebookEntry WHERE Product2Id = '" + product.Id + "'").Result;
                        var pricebookEntry = pricebookEntries == null ? null : pricebookEntries.Records.FirstOrDefault();

                        if (account == null)
                        {
                            CreateEmail("Account Not Found", "Client id: " + row["ClientID"].ToString() + " not found in Salesforce");
                        }
                        else if (product == null)
                        {
                            CreateEmail("Product Not Found","purchase product id: " + row["purchased_product_id"].ToString() + " not found in Salesforce");
                        }
                        else if (recordType == null)
                        {
                            CreateEmail("Record Type Not Found", "Order record type for oncorp not found in Salesforce");

                        }
                        else if (pricebookEntry == null)
                        {
                            CreateEmail("Pricebook Entry Not Found", "Pricebook entry for product: " + row["product_name"].ToString() + " id: " + row["purchased_product_id"].ToString() + " not found in Salesforce");
                        }
                        else
                        {
                            DateTime invoiceCycleDate = InvoiceCycleStart(int.Parse(row["InvoiceCycle"].ToString()), (DateTime)row["upt_timestamp"]);
                            var invoiceCycleDateFormat = invoiceCycleDate.ToString("yyyy-MM-dd");

                            var orders = SfClient.QueryAsync<Order>("SELECT id FROM Order WHERE AccountId = '" + account.Id + "' AND RecordTypeId = '" + recordType.Id + "' AND Oncorp_Order_Type__c = '" + row["InvoiceType"].ToString() + "' AND EffectiveDate = " + invoiceCycleDateFormat).Result;
                            var order = orders.Records.FirstOrDefault();
                            String orderId = order == null ? null : order.Id;

                            var GstTaxRate = GetTaxRate(row["gst_fee"], row["oncorp_fee"]);
                            var PstTaxRate = GetTaxRate(row["PstFee"], row["oncorp_fee"]);

                            if (orderId == null)
                            {
                                Order newOrder = new Order() { AccountId = account.Id, RecordTypeId = recordType.Id, Pricebook2Id = pricebookEntry.Pricebook2Id, Oncorp_Order_Type__c = row["InvoiceType"].ToString(), EffectiveDate = invoiceCycleDateFormat, Status = "Open" };
                                var createdOrder = SfClient.CreateAsync("Order", newOrder).Result;
                                orderId = createdOrder.Id;
                            }

                            orderItem = new OrderItem() { OrderId = orderId, PricebookEntryId = pricebookEntry.Id, Quantity = "1", NT_Disb_Rate__c = row["mccr_fee"].ToString(), UnitPrice = row["oncorp_fee"].ToString(), Fed_Tax_Rate__c = GstTaxRate.ToString(), Prov_Tax_Rate__c = PstTaxRate.ToString() };
                            var createdOrderItem = SfClient.CreateAsync("OrderItem", orderItem).Result;

                            UpdateOncorpItemSalesForceId(cmd, row["trans_id"].ToString(), createdOrderItem.Id);
                        }
                    }
					
					
					
private static async Task<ForceClient> ConnectToSalesforce()
        {
            var auth = new AuthenticationClient();

            Console.WriteLine("Connected to Salesforce");

            var client = new ForceClient(auth.InstanceUrl, auth.AccessToken, auth.ApiVersion);
            return client;
        }