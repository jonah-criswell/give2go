class AddHeadlineToStudents < ActiveRecord::Migration[8.0]
  def change
    add_column :students, :headline, :string
  end
end
