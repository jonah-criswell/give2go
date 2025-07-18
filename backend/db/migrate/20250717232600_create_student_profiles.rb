class CreateStudentProfiles < ActiveRecord::Migration[8.0]
  def change
    create_table :student_profiles do |t|
      t.references :student, null: false, foreign_key: true
      t.references :trip, null: false, foreign_key: true

      t.timestamps
    end
  end
end
