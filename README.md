# give2go
The Cru Internship design sprint capstone - Give2Go

## Overview
Give2Go is a mission trip fundraising platform that connects generous donors with students who are passionate about making a difference through Cru's mission trips. The platform is designed to help students with smaller networks leverage online tools to accelerate their fundraising efforts.

## Features
- **Student Profiles**: Browse and support individual students
- **Random Donations**: Let the system choose a student for you to support
- **Group Donations**: Support multiple students with a single donation using smart fund distribution
- **Search & Filter**: Find students by university, trip, or location
- **Real-time Updates**: See fundraising progress and goal completion in real-time

## Group Donation Algorithm

The core feature of Give2Go is the intelligent group donation system that ensures fair and efficient distribution of funds among multiple students. Here's how it works:

### Core Distribution Algorithm

```ruby
def distribute_donation(eligible_students, total_amount)
  distributions = []
  remaining_amount = total_amount

  # First pass: distribute evenly, but don't exceed any student's goal
  base_amount_per_student = total_amount / eligible_students.length
  
  eligible_students.each do |student|
    goal_amount = student.trip.goal_amount
    current_balance = student.balance
    max_can_receive = goal_amount - current_balance
    
    amount_for_student = [base_amount_per_student, max_can_receive].min
    
    distributions << {
      student: student,
      amount: amount_for_student,
      goal_amount: goal_amount,
      current_balance: current_balance,
      max_can_receive: max_can_receive
    }
    
    remaining_amount -= amount_for_student
  end

  # Second pass: redistribute excess funds to students who haven't reached their goal
  if remaining_amount > 0
    redistribute_excess(distributions, remaining_amount)
  end

  # Calculate average amount actually distributed
  total_distributed = distributions.sum { |d| d[:amount] }
  average_amount = total_distributed / distributions.length

  {
    distributions: distributions,
    average_amount: average_amount,
    total_distributed: total_distributed
  }
end

def redistribute_excess(distributions, excess_amount)
  # Get students who haven't reached their goal and can receive more
  eligible_for_redistribution = distributions.select do |d|
    d[:amount] < d[:max_can_receive]
  end

  return if eligible_for_redistribution.empty?

  # Distribute excess evenly among eligible students
  excess_per_student = excess_amount / eligible_for_redistribution.length
  
  # Track how much we actually distributed in this round
  distributed_this_round = 0
  
  eligible_for_redistribution.each do |distribution|
    additional_amount = [excess_per_student, distribution[:max_can_receive] - distribution[:amount]].min
    distribution[:amount] += additional_amount
    distributed_this_round += additional_amount
  end

  # If we couldn't distribute all the excess in this round, try again with remaining amount
  remaining_excess = excess_amount - distributed_this_round
  if remaining_excess > 0
    redistribute_excess(distributions, remaining_excess)
  end
end
```

### How the Algorithm Works

1. **Initial Distribution**: Divides the total amount evenly among all eligible students, but caps each student at what they actually need to reach their goal.

2. **Excess Calculation**: Tracks any remaining funds that couldn't be distributed in the first pass.

3. **Smart Redistribution**: Takes the excess and redistributes it evenly among only the students who still need funds (haven't reached their goal).

4. **Recursive Redistribution**: If some students reach their goal during redistribution, the algorithm recursively redistributes any remaining excess among the still-eligible students.

5. **Fair Distribution**: Each round of redistribution only considers students who haven't reached their goal, ensuring no student gets more than they need.

### Example Scenario

Let's say you donate **$100** to a group of **4 students**:

**Initial Distribution ($25 each):**
- Student A needs $20 → receives $20 (excess: $5)
- Student B needs $30 → receives $25 (still needs: $5)
- Student C needs $25 → receives $25 (goal reached!)
- Student D needs $50 → receives $25 (still needs: $25)

**Redistribution of Excess ($5):**
- Student B receives $2.50 more (total: $27.50)
- Student D receives $2.50 more (total: $27.50)
- Student C and Student A have already reached their goal, so they don't receive more.

**Our system is smart:** The excess $5 from Student A is automatically redistributed evenly among the other students who still need funds, ensuring the best possible distribution without any student exceeding their goal!

## Technology Stack

### Frontend
- **React** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Vite** for build tooling

### Backend
- **Ruby on Rails** API
- **PostgreSQL** database
- **ActiveRecord** for ORM
- **Active Storage** for file uploads

## Getting Started

### Prerequisites
- Node.js (v18+)
- Ruby (v3.0+)
- PostgreSQL

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd give2go
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
bundle install
```

4. Set up the database:
```bash
rails db:create
rails db:migrate
rails db:seed
```

5. Start the development servers:

In one terminal (backend):
```bash
cd backend
rails server -p 3001
```

In another terminal (frontend):
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## API Endpoints

### Students
- `GET /api/v1/students` - List all students
- `GET /api/v1/students/:id` - Get specific student

### Donations
- `POST /api/v1/donations` - Create individual donation
- `POST /api/v1/group_donations` - Create group donation

## Contributing

This is a demo project for the OSM HQ internship design sprint week. Any financial transactions and data are fake and merely for demonstrational purposes.

## License

This project is for educational and demonstration purposes only.
