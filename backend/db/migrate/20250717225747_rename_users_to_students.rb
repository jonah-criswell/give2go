class RenameUsersToStudents < ActiveRecord::Migration[8.0]
  def change
    rename_table :users, :students
  end
end
