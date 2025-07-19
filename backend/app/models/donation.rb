class Donation < ApplicationRecord
  belongs_to :student

  validates :amount, presence: true, numericality: { greater_than: 0 }
  validates :note, length: { maximum: 300 }, allow_blank: true
  # name, email, phone are optional

  after_create :increment_student_balance

  validate :cannot_exceed_goal

  def cannot_exceed_goal
    if student && student.trip && student.trip.goal_amount
      goal = student.trip.goal_amount.to_f
      bal = student.balance.to_f
      amt = amount.to_f
      Rails.logger.info "[DEBUG] Validating donation: student_id=#{student.id}, balance=#{bal}, amount=#{amt}, goal=#{goal}"
      if bal + amt > goal
        errors.add(:amount, "would exceed the student's fundraising goal")
      end
    end
  end

  private
  def increment_student_balance
    Rails.logger.info "[DEBUG] Incrementing balance: student_id=#{student.id}, old_balance=#{student.balance}, amount=#{amount}"
    student.increment!(:balance, amount)
  end
end
