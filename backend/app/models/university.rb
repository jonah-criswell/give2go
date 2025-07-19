class University < ApplicationRecord
  has_many :students, dependent: :restrict_with_error
  
  validates :name, presence: true, uniqueness: true
  validates :abbreviation, presence: true, uniqueness: true, allow_blank: true
  
  def display_name
    abbreviation.present? ? "#{name} (#{abbreviation})" : name
  end
end
