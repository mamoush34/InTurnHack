# InTurn
A Web Application that gives users tools to track their job application status in a more automated way.
After you build the chrome extension, it'll prompt you to sign up using your google account to use it.
After the sign-up, if you go to an internship application that uses greenhouse.io, the extension will detect the application, and you'll be able to press begin application on the extension. In return, the user information will be automatically filled through the database. Currently, there's only a one demo user, but it'll be trivial to add more users in future. After you pressed begin application, the application information like job title, company, date applied and status of your application  automatically shows up in a list item in the home page of the web application. The extension captures this application automatically and puts it into database for the current user as well. You can filter through the applications dynamically using the search bar, on the home view. Inside the homeview, you can manually add new job applications from icon on top right and it'll be added to database and the list. You can also update the status of added job by clicking on status.

Future additions:
Detailed view of other information like recruiter contact, date posted, method of application, etc. on click on list items.
Sorting list items.
User creation and authentication.

To make and start webApp: type "npm run make"

To make chrome extension: in its folder type "npm run make"

To use it: You go to chrome://extensions on your browser, and then click load unpacked. Then select the build directiory inside chrome extension subdirectory. It should be added.


