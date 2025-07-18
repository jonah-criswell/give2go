class RemoveStudentFromTrips < ActiveRecord::Migration[8.0]
  def change
    remove_reference :trips, :student, null: false, foreign_key: true
  end
end
