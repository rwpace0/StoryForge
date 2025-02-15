Set up for the environments
1. Install Node.js for the frontend
Download Node.js here: https://nodejs.org/en

2. Set up npm
In the project directory terminal:

cd client
npm install
3. Install Python
Check if you have Python:

In the project directory terminal:

python --version
To install Python:

Directly install Python from the website: https://www.python.org/downloads/

4. Install Flask:
pip install Flask
5. Install Flask Library:
In our project directory:

cd backend
pip install Flask
pip install  Flask-SQLAlchemy
pip install flask-cors
python -m pip install
How to run the Project
To run the Frontend
In your project directory terminal 

cd client
npm run start
To run the Backend
If you are having the Front-end running, add another terminal to simultaneously run the backend.

In your project directory terminal (best-by-notification):

cd backend
python server.py
How to Contribute
1. Pull the latest changes
Before starting any work, ensure you're up-to-date with the latest version of the project. To pull the most recent changes from the remote repository, run:

git pull origin main
This command will fetch the latest changes from the main branch and merge them into your local repository.

2. Checkout a Branch
Before starting any work, ensure you're working on one of your own branches or a branch that you've been assigned to. To switch to a branch, run the following command in your terminal:

git checkout <branch-name>
If the branch doesn’t exist yet, create it:

git checkout -b <branch-name>
3. Make Changes (basically coding)
Implement your changes, bug fixes, or updates within the checked-out branch. Be sure to follow coding standards and project guidelines when contributing.

4. Commit Your Changes
After making changes, you need to stage and commit them. Make sure to use a meaningful and descriptive commit message to clearly explain what changes were made.

git add .
git commit -m "Your descriptive commit message"
5. Push the Branch to Origin
Once you're satisfied with your changes, push the branch to the remote repository on GitHub:

git push origin <branch-name>
6. Create a Pull Request (PR)
Go to the Best By Notification GitHub repository and create a pull request (PR) from your branch to the appropriate base branch (usually main).

Go to the Pull Requests tab.
Click on New Pull Request.
Choose your branch and the branch you want to merge into (e.g., main).
Add a description of the changes (along with images would be great) you made and submit the PR.
Once your pull request has been reviewed and approved by the maintainers, it will be merged into the main codebase.