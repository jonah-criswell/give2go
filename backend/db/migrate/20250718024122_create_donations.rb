class CreateDonations < ActiveRecord::Migration[8.0]
  def change
    create_table :donations do |t|
      t.decimal :amount
      t.string :name
      t.string :email
      t.string :phone
      t.string :note
      t.references :student, null: false, foreign_key: true

      t.timestamps
    end
  end
end
