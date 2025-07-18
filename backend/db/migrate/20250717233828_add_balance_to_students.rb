class AddBalanceToStudents < ActiveRecord::Migration[8.0]
  def change
    add_column :students, :balance, :decimal, precision: 10, scale: 2, default: 0.0
  end
end
