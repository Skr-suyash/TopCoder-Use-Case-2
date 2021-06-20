# Adobe Use Case 2 - CourseWare

A NodeJS Web Application built for Adobe Use Case 2 Challenge with the educational community in mind.

# Requirements
You should have **NodeJS** and **MongoDB** installed on your system.

# Installation
Extract and open the file and run ```npm install``` to install all the required packages and dependencies. Start your MongoDB server.

## Usage
1. Install all the dependencies using ```npm install```
2. Open a terminal and run ```node server.js``` in the src directory or ```npm start```
3. Open a web browser and go to http://localhost:3000/. You can change the PORT in the **config** file.
4. Register on the site.
5. Go to the courses section and click on the cards to open a course and then click on any chapter to open an Embedded PDF Viewer.
6. Add a comment using the Viewer and it will be displayed at the bottom in the Comments Section, Reply to it and this will be visible to all users. 
7. Open the WhiteBoard and type your notes and draw on the canvas and click on **Download PDF** button to download as PDF.

### Setting up Google Analytics Dashboard
1. Go to Google Analytics website: https://analytics.google.com/
2. If you are a new user set up a new Analytics account else else Goto Admin -> Property -> Tracking Info -> Tracking Code
3. Finally, you will get a gtag with a **TRACKING_ID**
4. Open the **config.js** file in the root directory of the project and replace the tracking ID there.
5. Next open the Analytics Dashboard Link present in the **IMPORTANT_LINKS** file and select the correct View.
6. Please select the correct date from above.

# Notable Features
**UI**
A clean and easy to navigate UI which resonates with the learning and course theme with stylish components.

**Perfomance and Code Quality**
A lot of attentation has been paid to perfomance and ligthouse gives a score of **98**. If you are testing please don't log in as it creates problems sometimes.
Linting is enabled and standard coding practices are followed.
Run ```npm run lint``` to test.

**Mobile Responsive**
The Website is completely mobile responsive.

**Collaborative Aspects**
Every comment and reply that is added is displayed in real-time to all users. This feature indirectly uses Adobe Embed SDK's Annotaion Tools.

**Analytics Dashboard**
A lot of useful events are tracked for the teachers like:- 
1. "Study Patterns of Students"
2. "Most Hardworking and Lagging Students" - Very useful for the teacher to get deep insights about students.
3. "Number of Chapter Completions and Student Names"
4. "Most Searched Terms" - Teachers can explain these terms again.
5. "Realtime the number of Students Studying" - When the teachers are using this dasboard, teachers can know how many students are studying.
6. "Average time Spent per Chapter"
7. "Number of Students Joined the Class" - This can be compared bt Total Students in the school.
8. "Chapter Downloads and Notes made" - These notes can be asked by teachers for Submission.
And some more useful events.

