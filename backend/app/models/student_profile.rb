class StudentProfile < ApplicationRecord
  belongs_to :student
  belongs_to :trip
  
  validates :student_id, uniqueness: { scope: :trip_id }
end
