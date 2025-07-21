# give2go
Cru Internship design sprint capstone - Give2Go

# Overview
  Give2Go is a mission trip fundraising platform that connects generous donors with students who are passionate about making a difference through Cru's mission trips. The platform is designed to help students with smaller networks leverage online tools to accelerate their fundraising efforts. This project was made during a design sprint week as part of the end of my internship with Cru, where groups of 6 interns each researched the biggest organizational barriers that are preventing summer missions participation, and built solutions to address these barriesrs. 
  
  According to our findings, finances were the biggest barrier that students had to overcome when preparing to go on a summer mission, and was the most frequent reason why clients we interviewed aren't interested in a Cru summer mission. That's why I built Give2Go: a go-fund-me like platform to significantly optimize ministry partner development initaitves.

# The Goal
  Cru mission trips are incredibly transformative expereinces where college students dedicate 1-8 weeks away from home to serve the local community, spread their faith, and experience life-changing grow in their walk with Christ. However, such ambitious endeavors don't come without a price tag, and the intimating financial contributions required to go on these trips discourage many college students from even considering them. 

  Currently, the only real way to raise the funds needed is to manually reach out to friends and family to inform them of their goal and ask for a donation. While we believe traditional support raising is important for strengthening relationships and growing closer with the Lord, the financial burden is daunting. When knew Cru needed to do more to equip students with the tools needed for success with fund raising.

  Give2Go is a network that connects mission-driven students with generous donors through an online giving platform, allowing students to get their name out there in order to significantly increase the funds they can recieve. Students will be no longer limited to their inner circle or the phone numbers in their contacts: Give2Go allows donations from anyone around the world. Acquitainces of students, passionate alumni, churches/organizates, and even complete strangers have hundreds of students at their disposal to donate to, which means students have a limitless supply of potential donors. 

  While we believe this online resource can be a game changer for students hesitant about committing to the lift-changing experience a summer mission can offer, we also don't want to take away from traditional support raising. Give2Go acts as another tool in the toolbox, and with the right marketing, having this tool known can convince many students to explore these trips who would have otherwise immediatelty shut down the idea because of the cost.

# Features
- **Student Profiles**: Browse and support individual students. Find your friends and family, or prayerfully considering giving to a student on the other side of the country
- **Random Donations**: Let the system choose a student for you to support, being a random student from your university, from a trip you went on in the past, or a completely random student
- **Group Donations**: Support multiple students with a single donation using smart fund distribution, by giving a donation to a university, trip, or even the entire student base
- **Search & Filter**: Find students by name, university or trip, and sort by progress to give to students struggling to raise funds
- **Real-time Updates**: See fundraising progress and goal completion in real-time
- **Authentication**: Allows students to set up an account to get their give link on the site. This is mainly for demo purposes; in practice, students would use their Okta/Cru account they used to apply for their trip.
- **Modern UI**: Leverages modern frontend frameworks for a beautiful and contempory user interface, powered by a powerful backend API.

# Tech Stack and Implementation:

### Frontend: uses industry-standard frameworks for a modern and intuitive user experience:
- **React** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Vite** for build tooling

### Backend: powered by Ruby on Rails - the framework of choice for Cru's engineers, aiming for an easier integration with existing cry systems:
- **Ruby on Rails** API
- **PostgreSQL** database
- **ActiveRecord** for ORM
- **Active Storage** for file uploads

### Development tools and philosopy:
- **Cursor IDE**: Leveraged cutting-edge articial intelligence tools to drastically accelerate development - crucial for getting production-grade systems off the ground in just one week
- **Deployment**: (Coming Soon)
- **Prototyping**: The purpose of this project was to be a proof-of-concept, taking advantage of AI to write a lot of the code, to focus more on system architecture, UI/UX design, creative features, and demonstrating
- **Capstone**: AI-assisted code does not mean this app was built with a single prompt - many hours of careful decision making & intentional design patterns were critical to publish a polished final product
- **Proof of Concept**: This app was rapidly built in less than a week - expect bugs!

# Group Donation Feature

The flagship feature of Give2Go that really makes our platform stand out is the intelligent group donation system that ensures fair and efficient distribution of funds among multiple students. To further encourage donations, we built algorithms in order to give donors the options to spread their donations accross multiple students. 

- Is a donor a passionate alumni whow wants to uplift students at the university they graduated from? They can donate to all students in the system who go to that university. 
- Did the donor go on a specific trip a year or two? They can give back to all the students raising support for that trip this year.
- Is the donor representing a church or external organization? They can give one big donation to the entire student base, funding the mission trip movement in its entirety. Here's how it works:

### Distribution Algorithm:

1. **Initial Distribution**: Divides the total amount evenly among all eligible students, but caps each student at the max they can recieve before they over shoot their goal amount.

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

## Unequal Distribution Algorithm

Give2Go also supports an advanced unequal distribution algorithm that allows donors to bias the distribution toward students with higher fundraising needs. This feature provides more nuanced control over how funds are distributed, by using a carefully designed mathematical forumla to calculate the funds each student recieves.

### How the Unequal Distribution Works:

#### 1. Hybrid Weighting System
The algorithm uses a **bias factor** (0-1) to blend two distribution methods:
- **Equal distribution**: `1 / N` (everyone gets the same)
- **Proportional distribution**: `need / totalNeed` (those with higher needs get more)

**Formula**: `weight = (1 - biasFactor) × equal + biasFactor × proportional`

#### 2. Recursive Redistribution
When a student reaches their goal, the algorithm:
1. **Caps** their allocation at their need
2. **Collects** the excess amount
3. **Recursively redistributes** the excess to remaining students
4. **Excludes** students who've reached their goal from further distribution

#### 3. Key Features
- **No waste**: All money is distributed (no student gets more than they need)
- **Fair**: Students with higher needs get proportionally more (when bias > 0)
- **Flexible**: Bias factor lets donors choose between equal vs. need-based distribution
- **Recursive**: Handles complex scenarios where multiple students reach goals simultaneously

#### 4. Example
Let's say a donor wants to donate $800 to students at the University of Georgia who are going on a Cru mission, which happens to be 3:
- **Student A**: Needs $200 (20% of the total need)
- **Student B**: Needs $300 (30% of the total need) 
- **Student C**: Needs $500 (50% of total need)

**Equal distribution (bias=0.0)**: $200, $300, $300 (after redistribution; A and B reach their goals, C gets the rest)
**Pure proportional (bias=1.0)**: $160, $240, $400 (20%, 30%, 50%)
**Custom Skew (bias=0.7, less equal, more need-based)**: $192, $248, $360 (24%, 31%, 45%)
**Custom Skew (bias=0.3, more equal, less need-based)**: $200, $264.77, $335.24 (A capped, B and C get the rest proportionally)

This ensures that students with higher fundraising needs receive more support while still maintaining fairness and preventing excess funds going to students who have already reached their goal.

### Behind the Scenes:
```ruby
def distribute_with_bias(amount_left, needs, bias_factor, total_need, n, excluded = Set.new)
  # Calculate weights for students not excluded
  weights = needs.map.with_index do |need, i|
    next 0 if excluded.include?(i) || need <= 0

    equal = 1.0 / (n - excluded.size)
    proportional = total_need > 0 ? need / total_need : equal
    (1 - bias_factor) * equal + bias_factor * proportional
  end

  total_weight = weights.sum
  return Array.new(n, 0) if total_weight == 0

  # Initial allocation
  allocation = weights.map { |w| (w / total_weight) * amount_left }

  # Cap at need and collect excess
  excess = 0
  capped = false
  result = Array.new(n, 0)

  allocation.each_with_index do |alloc, i|
    next if excluded.include?(i) || needs[i] <= 0

    if alloc > needs[i]
      excess += alloc - needs[i]
      allocation[i] = needs[i]
      capped = true
    end
    result[i] = allocation[i]
  end

  # Redistribute excess if needed
  if capped && excess > 0.0001
    new_needs = needs.map.with_index do |need, i|
      if excluded.include?(i) || allocation[i] >= need
        0
      else
        need - allocation[i]
      end
    end

    new_excluded = excluded.dup
    allocation.each_with_index do |alloc, i|
      new_excluded.add(i) if alloc >= needs[i]
    end

    recursive = distribute_with_bias(excess, new_needs, bias_factor, total_need, n, new_excluded)
    result.each_with_index { |val, i| result[i] = val + recursive[i] }
  end

  result
end
```


## Installation:

### Prerequisites
- Node.js (v18+)
- Ruby (v3.0+)
- PostgreSQL

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
