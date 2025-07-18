class Student < ApplicationRecord
  has_secure_password
  
  validates :name, presence: true
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :year, inclusion: { in: %w[1st 2nd 3rd 4th 5th grad_student other], allow_blank: true }
  validates :balance, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  
  # Associations
  has_one :student_profile, dependent: :destroy
  has_one :trip, through: :student_profile
  
  # For filtering students by university
  scope :by_university, ->(university) { where(university: university) }
  
  def display_name
    "#{name} (#{university})"
  end
  
  def formatted_balance
    "$#{balance.to_f.round(2)}"
  end
  
  def progress_percentage
    return 0 if trip.nil? || trip.donation_goal.nil? || trip.donation_goal.zero?
    ((balance.to_f / trip.donation_goal.to_f) * 100).round(1)
  end
end
