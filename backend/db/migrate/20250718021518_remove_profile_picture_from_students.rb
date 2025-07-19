class RemoveProfilePictureFromStudents < ActiveRecord::Migration[8.0]
  def change
    remove_column :students, :profile_picture, :string
  end
end
