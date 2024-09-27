// git init
function getLearnerData(courseInfo, assignmentGroup, learnerSubmissions) {
    // Validate the course ID
    if (assignmentGroup.course_id !== courseInfo.id) {
      throw new Error('Assignment group does not belong to the correct course.');
    }
  
    // Process data here...
  }
  
  function validateCourse(assignmentGroup, courseInfo) {
    if (assignmentGroup.course_id !== courseInfo.id) {
      throw new Error('Assignment group does not belong to the correct course.');
    }
  }
  
  function calculateWeightedAverage(assignments, submissions) {
    let totalScore = 0;
    let totalPointsPossible = 0;
  
    assignments.forEach(assignment => {
      const submission = submissions.find(sub => sub.assignment_id === assignment.id);
      if (submission) {
        const percentage = submission.score / assignment.points_possible;
        totalScore += submission.score;
        totalPointsPossible = assignment.points_possible;
      }
    });
  
    return (totalScore / totalPointsPossible) * 100;
  }
  
// Sample data for testing
const course = {
  id: 101,
  name: "JavaScript Fundamentals"
};

const assignmentGroup = {
  id: 1,
  name: "Assignments",
  course_id: 101,
  group_weight: 50,
  assignments: [
      { id: 1, name: "Assignment 1", due_at: "2023-09-10T00:00:00Z", points_possible: 100 },
      { id: 2, name: "Assignment 2", due_at: "2023-09-20T00:00:00Z", points_possible: 100 }
  ]
};

const learnerSubmissions = [
  {
      learner_id: 1,
      assignment_id: 1,
      submission: { submitted_at: "2023-09-09T00:00:00Z", score: 90 }
  },
  {
      learner_id: 1,
      assignment_id: 2,
      submission: { submitted_at: "2023-09-21T00:00:00Z", score: 80 } // Late submission
  }
];

// Main function to calculate learner data
function getLearnerData(course, assignmentGroup, learnerSubmissions) {
  try {
      // Validate that the assignment group matches the course
      if (assignmentGroup.course_id !== course.id) {
          throw new Error("Assignment group does not belong to the course");
      }

      const learnersData = {}; // Store data for each learner

      // Process each submission
      learnerSubmissions.forEach((submission) => {
          const assignment = assignmentGroup.assignments.find(a => a.id === submission.assignment_id);

          if (!assignment) {
              throw new Error(`Assignment with ID ${submission.assignment_id} not found.`);
          }

          // Check if the assignment is due
          const now = new Date();
          const dueDate = new Date(assignment.due_at);

          if (dueDate > now) {
              // Ignores assignments that are not due yet
              return;
          }

          // Apply late submission penalty if necessary
          const submittedDate = new Date(submission.submission.submitted_at);
          let score = submission.submission.score;
          if (submittedDate > dueDate) {
              score *= 0.9; // applies the 10% penalty? 
          }

          const percentage = (score / assignment.points_possible) * 100;

          // Add learner data or update existing one
          if (!learnersData[submission.learner_id]) {
              learnersData[submission.learner_id] = {
                  id: submission.learner_id,
                  totalPoints: 0,
                  totalScore: 0,
                  assignments: {}
              };
          }

          learnersData[submission.learner_id].totalPoints += assignment.points_possible;
          learnersData[submission.learner_id].totalScore += score;
          learnersData[submission.learner_id].assignments[assignment.id] = percentage;
      });

      // Format final results for each learner
      const result = Object.values(learnersData).map(learner => {
          const avg = (learner.totalScore / learner.totalPoints) * 100;
          return {
              id: learner.id,
              avg: avg,
              ...learner.assignments
          };
      });

      return result;

  } catch (error) {
      console.error(error.message);
  }
}

// Run the function with sample data
const learnerData = getLearnerData(course, assignmentGroup, learnerSubmissions);
console.log(learnerData)
