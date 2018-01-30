class ChequeRequestLine < ActiveRecord::Base
  belongs_to :cheque_request

  def after_save
    unless self.is_copying_project_file?
      self.cheque_request.ec_file_lawyer.ec_file.rpt_updated_at = Time.now    # update for Rpt document generation
      self.cheque_request.ec_file_lawyer.ec_file.save!
    end
  end

  def after_destroy
    self.cheque_request.ec_file_lawyer.ec_file.rpt_updated_at = Time.now    # update for Rpt document generation
    self.cheque_request.ec_file_lawyer.ec_file.save!
  end

  def copying_project_file!
    @is_copying_project_file = true
  end

  def is_copying_project_file?
    @is_copying_project_file == true
  end
end