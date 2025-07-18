class Trip < ApplicationRecord
  has_many :student_profiles, dependent: :destroy
  has_many :students, through: :student_profiles
  
  validates :name, presence: true
  validates :location_country, presence: true
  validates :location_city, presence: true
  validates :goal_amount, presence: true, numericality: { greater_than: 0 }
  validates :donation_deadline, presence: true
  
  validate :donation_deadline_cannot_be_in_past
  
  private
  
  def donation_deadline_cannot_be_in_past
    if donation_deadline.present? && donation_deadline < Date.current
      errors.add(:donation_deadline, "cannot be in the past")
    end
  end
end
