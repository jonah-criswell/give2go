class AddProfileFieldsToStudents < ActiveRecord::Migration[8.0]
  def change
    add_column :students, :bio, :text
    add_column :students, :major, :string
    add_column :students, :profile_picture, :string
  end
end
