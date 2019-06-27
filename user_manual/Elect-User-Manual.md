__Student Name__: Jake Grogan

__Student Name__: Martynas Urbanavicius

__Supervisor__: Stephen Blott

__Date__: 7th March 2019

---

# Elect - User Manual

## Table of Contents

- 1. __Signup/Login__
- 2. __Viewing User profile__
- 3. __Creating a poll__
- 4. __Viewing a poll__
- 5. __Casting a vote__
- 6. __View poll results__
- 7. __View poll statistics__
- 8. __Managing PGP security keys__


### 1. Signin/Signup
Elect doesn't feature a traditional signup process , instead your profile is made the first time you sign in. 
1. To sign in navigate to any page on Elect (elect-project.com) and click "sign in" in the top right corner or if you're on the home page you can also click the big "sign in" button in the middle of the page, both of these will take you to the sign in page.

![](https://i.imgur.com/DXArvWo.png)

2. On the sign in page click the big red button "sign in with google" this will open a Google signin pop up window.

![](https://i.imgur.com/ta66Q83.jpg)


3. Choose the google account you want to log in with or register a new google account 
4. If you have successfully signed in you will be taken to Elect home page.

### 2. Viewing User profile
#### requirements: sign in
- 1. Once you're signed in you can view your profile by clicking "My Account" at the top navigation bar, it should look something like this.

![](https://i.imgur.com/M4hgaKr.png)


- 2. From here you can also access the page for managing your encryption keys this will be covered at a later step.

### 3. Creating a Poll
#### requirements: signed in
- 1. Navigate to poll creation page by clicking "Create Poll" at the top navigation bar or if you're on the homepage you can also click "create a poll" button.

![](https://i.imgur.com/9DxN6E3.png)


- 2. Enter poll details
   - 2.1 Enter a poll title - this can be a question you're asking your voters e.g "Redbrick Chair Election", "Should we go on a trip to Brussels?".
   - 2.2 Select Poll type by clicking on the drop-down menu under "Poll Type".
   - 2.3 Add as many poll voting option fields as you need to clicking "Add Option".
   - 2.4 Enter each poll voting option in a separate voting poll option field.
   - 2.5 To make this poll extra secure which will require each voter to sign the vote with their PGP key tick "Xtra-Secure Poll" box by clicking it.
   - 2.6 To confirm and create the poll click "Submit" button.

### 4. Viewing a poll
If you have received a link to an Elect Poll simply open the link in browser, otherwise if you're the author of the poll :
- 1. Click "My Polls" in the top navigation bar, this will take you to a page featuring all the polls you have created.

![](https://i.imgur.com/2Snraro.png)


- 2. Click blue "view" button in line for the poll you want to view.

![](https://i.imgur.com/IUOvpfd.png)


- 3. If the poll is open got voting you will be taken to pole page otherwise you will be taken to the results page.


### 5. Casting a Vote
- 1. Navigate to poll page as instructed in "6. Viewing a poll"
- 2. Press blue "Cast Vote" button, this will take you to cast vote page.

![](https://i.imgur.com/If7yeW1.png)

- 3. Select the option you would like to vote on by clicking on the circular button to the left of the vote option.
#### Step 4 Only for Xtra-secure polls
#### requirements : generated PGP security key (#10 Manage PGP security keys)

![](https://i.imgur.com/Va4LA02.png)

- 4. If you see a field asking you to "Paste your PGP RSA private key here" it means that this poll requires you to sign your vote. To do this open your PGP private key that you have downloaded or generate one by following "#10 Manage PGP security keys", copy the contents of the file and paste it in the PGP security key field on the cast vote page.
- 5. Click the "Submit" button to cast your vote

### 6. View Poll Results
#### requirements: signed in, participant in the poll, poll closed
There are a few different ways to view poll results. 
- 1.1. If you have received a link to a poll page e.g "http://www.elect-project.com/poll/8qpqjWO" simply open the link in a browser
- OR
- 1.2.1. If you're the author of the poll click "My Polls" in the top navigation bar, this will take you to a page featuring all the polls you have created.

- 1.2.2. Click blue "view" button in line for the poll you want to view.

- 2. Press the "view results" button, you will be taken to the results page which should look something like this.

![](https://i.imgur.com/BJzniKX.png)



### 7. View Poll Statistics
#### requirements: signed in, author of the poll
- 1. Click "My polls" at the top navigation bar
- 2. click "statistics" button in line with the poll statistics you want to view, statistics page should look something like this.

![](https://i.imgur.com/D2oiOsY.png)

### 8. Managing PGP Security keys
#### requirements: signed in 
A PGP security key is a file that contains your private key. This private key shouldn't be shared with anyone as it is used to verify your user identity. Elect uses PGP security keys for signing votes in Xtra-secure polls. 
**PGP key generation is a one time process that can only be performed once, that means once you generate your PGP security key on Elect you will not be able to generate it again. We recommend saving the security key in multiple safe, only accessible to you places where files are permanently available.**
To generate your PGP security key :
- 1. Navigate to your account page by clicking "My Account" in the top navigation bar.
- 2. Click "Manage encryption keys", you will be taken to a page that looks something like this.

![](https://i.imgur.com/kutAE8u.png)

- 3. Press the "Generate key pair" button and wait, this process should usually take  less 5 seconds. When the key is generated your screen will look something like this.

![](https://i.imgur.com/nwHFIvH.png)

- 4. At this stage, you must press the "Download private key" button to download your private security key. Make sure to not leave the page before downloading as you will not be able to generate a new key again.
- 5. Save the key in a safe, permanently available and only accessible by you place.


