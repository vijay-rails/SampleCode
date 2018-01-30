class ChequeRequestLineController < Access::MemberController
  
  def create
    return_data = Hash.new()

    cheque_request_line = ChequeRequestLine.new(params[:cheque_request_line])
    @cheque_request = ChequeRequest.find_by_ec_file_id_and_ec_file_lawyer_id(Session.ec_file_id, Session.ec_file_lawyer_id)
    cheque_request_line.cheque_request_id = @cheque_request.id
    cheque_request_line.ordinal = max_ordinal(@cheque_request.id) + 1
    cheque_request_line.save

    sort_cheque_request

    return_data[:html] = render_to_string :partial => "/accounting/trust_reconciliation/cheque_request"
    render :text => return_data.to_json, :layout => false
  end

  def update_payee
    payee = params[:payee]
    cheque_request_line_id = params[:id]

    ChequeRequestLine.update(cheque_request_line_id, {:payee => payee})

    render :text => 0
  end

  def update_description
    description = params[:description]
    cheque_request_line_id = params[:id]

    ChequeRequestLine.update(cheque_request_line_id, {:description => description})

    render :text => 0
  end

  def update_amount
    return_data = Hash.new()
    amount = params[:amount]
    cheque_request_line_id = params[:id]

    if params[:id]
      cheque_request_line = ChequeRequestLine.find(cheque_request_line_id)
      cheque_request_edit = ChequeRequest.find(cheque_request_line.cheque_request_id)
      begin
        cheque_request_line.update_attribute(:amount, amount)
        update_totals_after_amount_change(cheque_request_edit)
      rescue => e
        logger.error("Unable to update cheque request line amount Error message: " + e.to_s)
        throw e
      end
    end

    @cheque_request = ChequeRequest.find_by_id(cheque_request_line.cheque_request_id)
    sort_cheque_request

    return_data[:html] = render_to_string :partial => "/accounting/trust_reconciliation/cheque_request"
    render :text => return_data.to_json, :layout => false
  end

  def reorder
    orders = params[:orders]
    orders.each do |key, value|
      ChequeRequestLine.update(key, {:ordinal => value})
    end
    render :text => 0
  end

  def destroy
    return_data = Hash.new()
    return_data[:affected] = 0

    if request.delete? and params[:id]
      cheque_request_line = ChequeRequestLine.find(params[:id])
      @cheque_request = ChequeRequest.find_by_id(cheque_request_line.cheque_request_id)
      begin
        cheque_request_line.destroy
        update_totals_after_line_delete(cheque_request_line)
        return_data[:affected] = return_data[:affected] + 1
      rescue => e
        logger.error("Unable to delete cheque request line Error message: " + e.to_s)
        throw e
      end
    end

    sort_cheque_request

    return_data[:html] = render_to_string :partial => "/accounting/trust_reconciliation/cheque_request"
    render :text => return_data.to_json, :layout => false
  end

  private

  def update_totals_after_line_delete(cheque_request_line_to_be_deleted)
    amount_removed = cheque_request_line_to_be_deleted.amount

    total = @cheque_request.cheque_request_lines.find_by_itemable_type("total")
    new_trust_balance = @cheque_request.cheque_request_lines.find_by_itemable_type("new_trust_balance")

    total.amount = total.amount - amount_removed
    new_trust_balance.amount = new_trust_balance.amount + amount_removed
    total.save
    new_trust_balance.save

  end

  def update_totals_after_amount_change(cheque_request_edit)
    total = cheque_request_edit.cheque_request_lines.find_by_itemable_type("total")
    trust_balance = cheque_request_edit.cheque_request_lines.find_by_itemable_type("trust_balance")
    new_trust_balance = cheque_request_edit.cheque_request_lines.find_by_itemable_type("new_trust_balance")


    total.amount = 0

    cheque_request_edit.cheque_request_lines.each do |cheque_request_line|
      unless cheque_request_line.itemable_type.eql? "total" or cheque_request_line.itemable_type.eql? "new_trust_balance" or cheque_request_line.itemable_type.eql? "trust_balance"
        total.amount += cheque_request_line.amount
      end

    end

    #new_trust_balance.update_attribute(:amount, trust_balance.amount - total.amount)
    new_trust_balance.amount = trust_balance.amount - total.amount
    total.save
    new_trust_balance.save

  end

  def max_ordinal(cheque_request_id)
    (ChequeRequestLine.maximum :ordinal, :conditions => ["cheque_request_id = ?",cheque_request_id]) || 0
  end

  def sort_cheque_request
    @cheque_request.cheque_request_lines.sort!{ |x,y| x["ordinal"] && y["ordinal"] ? (x["ordinal"] <=> y["ordinal"]) : (x["ordinal"] ? -1 : 99)}
  end


end
