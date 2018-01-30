<div class="panel panel-primary">
  <div class="panel-heading clearfix" style="padding: 5px 15px 5px 15px;">
    <h4>Cheque Request</h4>
    <div class="btn-toolbar pull-right">
      <button id="add_new_line" class="btn btn-sm btn-default" onclick="ChequeRequest.addNewLine()" ><i class="fa fa-plus fa-lg"></i> Add New Line</button>
      <button id="add_new_line" class="btn btn-sm btn-danger" onclick="ChequeRequest.deleteChequeRequest(<%= @cheque_request.id unless @cheque_request.blank? %>)" ><i class="fa fa-trash-o fa-lg fa-color-white"></i> Delete Cheque Request</button>
    </div>

  </div>

  <table id="table_cheque_request_list" class="table_short_list table table-condensed table-hover" width=100%>
    <thead>
    <tr class="nodrop nodrag">
      <th width="9%"></th>
      <th style="text-align: left;">Payable To</th>
      <th style="text-align: left;">Description</th>
      <th style="text-align: left;">Amount</th>
    </tr>
    </thead>

    <tbody>
    <% if @cheque_request.present? %>
      <% cheque_request_current_balance = @cheque_request.cheque_request_lines.select{|line| line.itemable_type == "trust_balance" }.first %>
      <% cheque_request_total = @cheque_request.cheque_request_lines.select{|line| line.itemable_type == "total" }.first %>
      <% cheque_request_new_balance = @cheque_request.cheque_request_lines.select{|line| line.itemable_type == "new_trust_balance" }.first %>

        <tr id="tr_current" class="nodrag nodrop">
          <td></td>
          <td></td>
          <td style="text-align: right;"><b><%= cheque_request_current_balance.description %></b></td>
          <td><span id="total_amount"><%= number_to_currency cheque_request_current_balance.amount if cheque_request_current_balance.amount %></span><input id="total_id" type="hidden" value="<%= cheque_request_current_balance.id %>"/></td>
        </tr>

      <% @cheque_request.cheque_request_lines.each do |cheque_request_line| %>
        <% unless ["total","new_trust_balance","trust_balance"].include? cheque_request_line.itemable_type %>
            <tr id="<%= cheque_request_line.id %>">
              <td class="dragndrop">
                <table class="phasedout">
                  <tr>
                    <td width="16">
                      <img src="/themes/blue/images/drag.png" />
                    </td>
                    <td>
                      <a onclick='javascript: ChequeRequest.deleteLine ("<%= cheque_request_line.id %>"); '><img src="/themes/blue/images/close.png" /></a>
                    </td>
                  </tr>
                </table>
              </td>
              <!--<td style="cursor:pointer;">-->
              <td>
                <span class="cheque_payee" onclick="ChequeRequest.inlinePayeeEdit(this, <%= cheque_request_line.id %>)"><%= cheque_request_line.payee.blank? ? "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" : cheque_request_line.payee%></span>
                <span id="payee_reset_<%= cheque_request_line.id %>" class="inlinePayeeReset" style="display: none;"><a onclick="javascript: ChequeRequest.resetInlinePayee (this,<%= cheque_request_line.id %>); "><img src="/themes/caon_pro/images/reset.png" title="Reset Payee"></a></span>
              </td>
              <td>
                <span class="cheque_description" onclick="ChequeRequest.inlineDescriptionEdit(this, <%= cheque_request_line.id %>)"><%= cheque_request_line.description %></span>
                <span id="description_reset_<%= cheque_request_line.id %>" class="inlineDescriptionReset" style="display: none;"><a onclick="javascript: ChequeRequest.resetInlineDescription (this,<%= cheque_request_line.id %>); "><img src="/themes/caon_pro/images/reset.png" title="Reset Description"></a></span>
              </td>
              <td>
                <span onclick="ChequeRequest.inlineAmountEdit(this, <%= cheque_request_line.id %>)"><%= number_to_currency cheque_request_line.amount if cheque_request_line.amount %></span>
              </td>
            </tr>
        <% end %>
      <% end %>

        <tr id="tr_total" class="nodrag nodrop">
          <td></td>
          <td></td>
          <td style="text-align: right;"><b><%= cheque_request_total.description %></b></td>
          <td><span id="total_amount"><%= number_to_currency cheque_request_total.amount if cheque_request_total.amount %></span><input id="total_id" type="hidden" value="<%= cheque_request_total.id %>"/></td>
        </tr>

        <tr id="tr_new_trust_balance" class="nodrag nodrop">
          <td></td>
          <td></td>
          <td style="text-align: right;"><b><%= cheque_request_new_balance.description %></b></td>
          <td><span id="new_trust_balance_amount"><%= number_to_currency cheque_request_new_balance.amount if cheque_request_new_balance.amount %></span><input id="new_trust_balance_id" type="hidden" value="<%= cheque_request_new_balance.id %>"/></td>
        </tr>
    <% end %>
    </tbody>
  </table>
</div>


<script type="text/javascript">
  jQuery(document).ready(function(){
    var startIndex;
    var dropIndex;
    jQuery("#table_cheque_request_list").tableDnD({

      onDrop: function(table, row){
        dropIndex = jQuery_3_1_0(row).index();
        if(dropIndex != startIndex){
          ChequeRequest.updateLineOrder(table);
        }
      },

      onDragStart: function(table, row){
        startIndex = jQuery_3_1_0(row).parent().index();
      },

      dragHandle: ".dragndrop"

    });
  });
</script>