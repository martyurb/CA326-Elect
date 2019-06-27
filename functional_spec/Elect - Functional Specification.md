__Student Name__: Jake Grogan

__Student Name__: Martynas Urbanavicius

__Supervisor__: Stephen Blott

__Date__: 07/12/18

---

# Elect - Functional Specification

## Table of Contents
- 1. __Introduction__
    - 1.1 Overview
    - 1.2 Glossary of Terms
- 2. __General Description__
    - 2.1 System Functions
    - 2.2 Objectives
    - 2.3 Operational Environment
    - 2.4 Implementation Constraints
    - 2.5 Scenarios
    - 2.6 Operational Attributes
        - 2.6.1 Scalability
        - 2.6.2 Security
- 3. __Functional Requirements__
    - 3.1 Signup/Login
    - 3.2 Create Vote
    - 3.3 Close Vote Early
    - 3.4 Vote Results
    - 3.5 Vote Statistics
    - 3.6 Account Settings
    - 3.7 Extra-Secure Votes
    - 3.8 Uploading Encryption Keys
    - 3.9 Generating Encryption Keys 
    - 3.10 Voting Types
- 4. __System Architecture__
    - 4.1 Cloud Architecture (+Diagram)
    - 4.2 Mean Stack System Design (+Diagram)
- 5. __High Level Design__
    - 5.1 Signup and vote creation
        - 5.1.1 Description
    - 5.2 Signup, pgp key setup and secure vote participation
        - 5.2.1 Description
- 6. __Preliminary Schedule__
    - 6.1 Overview
    - 6.2 Task List
- 7. __Appendix__
    - 7.1 Resources
    - 7.2 References

## 1. Introduction

### 1.1 Overview

The premise of this web application is to allow clubs, societies, groups and organisations to carry out votes for elections. Users who wish to conduct a vote or election will have many options including straw polls, plurality electoral systems and single transferable vote. Users will also have the option to make these extra secure with the use of PGP Cryptography to sign the votes. You can think of this as the Doodle for voting and elections.

Creators of polls/elections will also have the option to customise the voting environment. For example, creators will have the option to restrict the votes to only accept votes from certain email addresses. They will also have the option to display to everyone in the vote, who voted but not who they voted for, this gives a degree of transparency and helps ensure people who aren't supposed to vote haven't. It also ensures there isn’t any cheating in the votes (People haven’t voted twice or made fake email accounts). Creators will also have the option to enable IP duplication checking on open straw polls so that voters should be deterred from voting more than once. Once a vote is created a unique shareable URL will be given which will be used to access the voting page.

When a vote has concluded, statistics of the vote will be available to the creators in the form of graphs.

### 1.2 Glossary of Terms

- __MongoDB__: MongoDB is a free open-source cross-platform document-oriented database program. Classified as a NoSQL database program, MongoDB uses JSON-like documents with schemata.

- __Angular__: Angular is a TypeScript based open-source front-end web application platform.
- __TypeScript__: TypeScript is an open-source programming language developed and maintained by Microsoft. It is a strict syntactical superset of Javascript, and adds optional static typing to the language.
- __Node.JS__: Node.JS is an open-source, cross-platform JavaScript run-time environment that executes JavaScript code outside of a browser. Node.JS allows developers use JavaScript to write command line tools and server-side scripts.
- __Express.JS__:Express.js is an open source web application framework for Node.js. It is designed for building we applications and APIs.
- __HTML__: Hypertext Markup Language is the authoring language used to create documents on the web. 
- __Bootstrap__: Bootstrap is an open source front end framework for websites and web applications.
- __AWS__: AWS (Amazon Web Services) is Amazon's cloud computing platform. It provides on-demand, elastic computing services to organizations and individuals.
- __VPC__: VPC (Virtual Private Cloud) is "Your own data center in the cloud". VPC lets you provision a logically isolated section of the AWS Cloud where you can launch AWS resources in a virtual network that you define. VPC provides complete control over your virtual networking environment, including selection of your own IP address range, creation of subnets, and configuration of route tables and network gateways.
- __EC2__: AWS Elastic Compute Cloud (EC2) is a web service that provides secure, resizable compute capacity in the cloud.
- __OpenPGP__: Open PGP is an open source implementation of PGP. Pretty Good Privacy (PGP) is an encryption program that provides cryptographic privacy and authentication for data communication. PGP is used for signing, encrypting, and decrypting texts, e-mails, files, directories, and whole disk partitions and to increase the security of e-mail communications. This is under [RFC 4880](https://tools.ietf.org/html/rfc4880)
- __Digital Signatures__: A digital signature is a mathematical scheme for verifying the authenticity of digital messages or documents.

---
## 2. General Description
### 2.1 System Functions
Below is an overview of the systems main functions. It is a preliminary list and is open to change. Each function in this list will be discussed in further detail in section 3.

- Sign up
- Login
- Create poll 
- Customize poll settings
- View your polls
- Poll Statistics
- Poll voting
- View Poll Conclusion

### 2.2 Objectives
This system will be hosted online and so it will be accessible to anybody with internet access. The target audience will be societies, clubs, students and other organisations/groups who wish to conduct a vote and don't have their own system to do it.

The web app will feature ease of accessibility and a user-friendly interface that will also cater to people with disabilities.

### 2.3 Operational Environment

The application will be hosted on AWS. We will set up a VPC with both public and private facing subnets.
The front-end will be accessible through these public subnets. The back-end and database will be hosted on EC2 Linux instances in the private facing subnets. There will be an elastic load balancer in front of the public subnet which will distribute the traffic to the public facing server fleet. 
These public facing servers will be placed in an auto-scaling group and will horizontally scale based on certain server metrics.
The front-end will be developed using Angular 6. The back-end will be developed with Express.js, on top of a Node.js server.
We have decided to use MongoDB as our database as the data is not strongly related and our stack is javascript so storing JSON like objects makes sense. 

### 2.4 Implementation Constraints

We are facing many constraints in this project. However, most are not a worry as we should not need to scale to support thousands of users. The major constraints we face are listed below.

- __Cost__: As we are hosting our platform on AWS, we will have to venture outside the free tier range. We will need three instances running (at minimum) at all times. One for the frontend, one for the backend and another for the database. We are able to get 750 hours per month of EC2 for free, and we begin to incur costs thereafter. Although it wont be much we need to be careful about our cloud environment configurations as we don't want to accidentaly start horizontally scaling any servers as this would get pricey.
- __Time__: As with most web applications, developers could add an endless amount of features. We need to be sure that we select a manageable amount of features to include in the final product. For this reason we have selected three voting options to start with. If we have time after these three options have been implemented we shall add the others listed in section 2.1. 

### 2.5 Scenarios
There will be many different scenarios under which the proposed website will perform. These are mainly based around the users authentication status. Users will have access to different voting options based on their authentication status.

- __Unregistered User:__ Unregistered users will be very limited as to what functionality of the site they can use. 
    - __Create Strawpoll:__ Unregistered users will be allowed to create strawpolls and share the link to that strawpoll.
    - __Options:__ Unregistered users will be limited to the voting options they have on these strawpolls. They will only be able to enable IP duplication checking which will help deter people from voting multiple times. 
    - __Results:__ Unregistered users will also be able to view the results of the vote. 

- __Registered Users:__ Registered users will have full access to the sites functionality. 
    - __Creating votes:__ Registered users will be allowed to created any type of vote available on the site. Only registered users will be allowed to vote on all types of vote except strawpoll which is open to everyone.
    - __Extra Secure Votes:__ Only registered users will be allowed to create extra secure votes and only registered users will be allowed to vote on these kinds of votes as a public key uploaded/generated by the user is required. 
    - __Vote Statistics:__ Only registered users who created votes will have access to the full statistics of that vote. Users who voted will only have access to the results. 
    - __Vote Results:__ Only registered users will have access to the results of votes, unless that vote is a strawpoll. Users who participate in votes will not have access to the statistics of that vote. 
    - __Options:__ All users will have the option to add IP duplication tracking to strawpolls. Other votes will have options to add transparency (Everyone can see who voted but not what they voted for), Extra secure (voters must sign their votes with their PGP key), current vote state (voters can see the current state of the vote), end date (Creator can specify when the vote will end, otherwise the vote stays open forever) and finally registered users will have the option to restrict who can vote based on their email domain.


### 2.6 Operational Attributes
#### 2.6.1 Scalability

- With most web applications, they should be prepared to deal with high user volume and growth. With this application we have potential scenarios such as a celebrity creating some type of poll and sharing that with hundreds of thousands, potentially millions, of people. Although unlikely for this project, we still need to design our system in such a way that it can scale to that level with little trouble. This is where AWS comes in.
- Thanks to the elastic nature of most AWS services, we have no trouble scaling to meet these demands. Our front-end and back-end application servers will be placed in auto-scaling groups. This allows us to set triggers to start horizontally scaling our servers out to handle an increase in load. These triggers will be based on server metrics such as CPU utilization. 
- We can also create read replicas of our mongoDB instance. This allows us to hand off read requests to these instances during times of high load. 

#### 2.6.2 Security

- Security is of utmost importance on the web. We can't afford data leaks, or be open to potential hacks. 
- Our application servers and databases will be in a private subnet that will only be able to be accessed through servers in the public subnets. We can restrict what IP addresses can access these servers. 
- We can also set up security groups and network access control lists. The security groups will act on an instance basis while the NACLs will act on a subnet basis. This adds an extra layer of protection to both servers and subnets. 
- Placing servers in autoscaling groups also helps mitigate against DDoS attack
- The use of AWS Identity & Access Management (IAM) gives us fine-grained access to our AWS resources. We can enable multi-factor authentication on users associated with the project to add an additional layer of security so that if anyone trys to access our resources via API calls or through the management console they will need to use 2FA.

---

## 3. Functional Requirements
### 3.1 Signup / Login
- __Description__: Signup and Login functionality is critical to the operation of the system. Users must be signed up and logged-in in order to use the platform. Users will be brought to a form that will allow them to signin with Google Authentication or Signup using google authentication. In the case of login, users will be redirected to their dashboard. In the case of signup users will be redirected to a page asking if they want to upload their public encryption keys.
- __Priority__: We deem this to be one of the essential features as user accounts will be required to create and cast votes (except on strawpolls which will on require an account to vote).
- __Issues__: We don't expect any issues as we'll be using OAuth to handle authentication.
- __Dependencies__: Google, OAuth2.0 

### 3.2 Create Vote
- __Description__: Users should be allowed to create many types of votes including straw polls, plurality electoral systems, majority electoral systems, proportional representation, single transferable vote. This create votes page will be accessible from the dashboard. Users will have options to customise the votes from here. These will include, vote transparency (Users can see who voted but not what they voted for), Extra-secure (This will sign the votes to ensure the correct user has voted). On straw polls we can enable IP tracking to deter users from voting multiple times as you don't need to be signed in to vote on a strawpoll. 
- __Priority__: We deem this to be one of the most essential features as voting is central to this app. It will have highest priority out of all features.
- __Issues__: We don't expect this feature to cause any issues.
- __Dependencies__: User being signed in

### 3.3 Close Vote Early
- __Description__: Option to close the vote early. This will stop users from being able to vote, Otherwise a vote will automatically close at the specified time which will be provided at vote creation stage.
- __Priority__: This feature is deemed to be a medium priority feature. It would be useful for creators of votes to close them early but it is not a requirement for the site to function. 
- __Issues__: We don't expect this feature to cause any issues.
- __Dependencies__: Create vote, User signed in

### 3.4 Vote results
- __Description__: View the results related to the vote, total number of votes and vote option distribution. When making a vote you will be able to choose if you want vote results to be accessed at any point while the vote is on or only after the vote has finished (if scheduled vote end time is specified) as well as the option of who is allowed to see it, e.g public, only participants or only the creators of the poll.
- __Priority__: This is an important feature of the site. Everyone who voted should have access to the results of the vote. We deem this critical to the functionality of the site.
- __Issues__: We don't expect this to cause any major issues.
- __Dependencies__:  Create Vote, Participated in the vote.

### 3.5 Vote statistics
- __Description__: View the statistics related to the vote including total number of participants in that vote, total number of views of that vote, the scheduled time the vote is supposed to end (if there is one), many different graphs including pie charts for vote distribution, line charts for vote distribution over time which will also show how the the vote is trending and predicted trend for the future.
- __Priority__: This is also an important feature. Creators of votes should have access to the statistics surrounding the vote as they can gain insights into how people voted.
- __Issues__: We don't have any experience with the javascript data visualisation libraries. However we don't think this should be too big of an issue.
- __Dependencies__:  Create Vote, Signed In, Participated in the vote.

### 3.6 Account Settings
- __Description__: Users should be able to view their accounts and update any settings they find necessary. 
- __Priority__: We don't deem this feature to be essential to the functionality of the site however users should be allowed to edit some of their account settings if they feel necessary.
- __Issues__: We don't expect this to cause any issues.
- __Dependencies__: User accounts, Signup/Login

### 3.7 Extra-Secure Votes
- __Description__: As an option users will be able to create Extra-secure votes which will use PGP RSA encryption keys. To vote on an extra-secure vote the user will be required to provide their PGP private key as a file which will be used by our system to verify that the users private key matches with the public key we have in our database. This will be done by signing a message client side using the private key the user provides, then the signed message will be send to our servers and verified using the public key stored in our database. If the verification process is successful i.e the keys match the users identity is verified and the cast vote will be accepted. Note : (The private key is never sent to us in this process)
- __Priority__: We deem this an important feature of the site. Users should have comfort in the fact that for someone who voted, we can guarantee it was them.
- __Issues__: We don't have experience with public key cryptography and OpenPGP but that should be ok to work with and we expect no major blockages here.
- __Dependencies__: Create votes, Signed In.

### 3.8 Upload Encryption Keys
- __Description__: After sign up users will be redirect to the setup encryption keys page where they will have the option to upload their own generated PGP public key or to use a key generated by us. If the user chooses to use the key generated by us then the user will be provided(download) with a private key and the public key will be kept in our database. This is once off and users will not be able to upload them again. 
- __Priority__: We will add in a feature that we automatically generate encryption keys for the user when they sign up. However, it would be nice for users to be able to generate their own encryption keys and send us their public key.
- __Issues__: We don't expect to have any issues with this feature.
- __Dependencies__: Login

### 3.9 Generate Encryption Keys
- __Description__: On the setup encryption keys page, users will have the option of allowing us to generate the PGP key pair. They will have the option to download the private key. This is the only time the download is offered. If users lose the key, they cannot participate in extra-secure votes.
- __Priority__: This is essential for the functionality of the extra secure votes. Without this feature, extra secure voting option wouldn't be possible
- __Issues__: We need to figure out how the OpenPGP library works but we dont think it will cause any major roadblocks.
- __Dependencies__: OpenPGP

### 3.10 Vote Types
- __Straw Poll__: Straw polls will allow a signed in user to create a poll. This can be distributed via a shareable URL. People may vote on this without being signed in. For this, we will include a track IP option to better tamper proof this vote type. 
- __All others__: All of the other types will require you to be signed in to participate in the vote.

---

# 4.System Architecture
### 4.1 Cloud Architecture Diagram
![](https://i.imgur.com/8vrf3jt.png)

The above diagram illustrates the cloud architecture we will follow during implementation. There are many different aspects to this design. It is designed in such a way as to provide scalability, security and fault-tolerence.

- __VPC (Virtual Private Cloud)__: Our whole platform will be hosted inside a VPC, which is a logically  isolated section of the AWS Cloud where we can launch AWS resources in a virtual network that is defined by us. VPC provides complete control over our virtual networking environment, including selection of our own IP address range, creation of subnets, and configuration of route tables and network gateways.

- __Internet Gateway__: An internet gateway is a VPC component that allows communication between resources in our VPC and the internet. It is horizontally scaled and highly available which in turn means it will not introduce a bottleneck into the system. 

- __Elastic Load Balancer__: Elastic Load Balancer is a highly available load balancer (automatic scaling) that provides a lot of crucial functionality such as health checks on the VM instances. If it detects an unhealthy VM it will no longer route traffic to it. It also provides logging options so we can monitor request count and latency it records all of these requests in an S3 Bucket.
- __Linux EC2 Instances__: These are our VMs that will provide the front-end to the user. They are placed in an autoscaling group to handle large amounts of traffic. They will automatically scale based on certain server metrics.
- __Bastion Host:__ The bastion host will be used by the administrators to SSH into the servers in the backend to perform any maintenance deemed necessary. Access to this machine will be IP restricted.
- __Application Servers__: The application servers are also Linux EC2 instances. They will host the back-end and will interface with angular on the front-end via a REST API. It will also interface with the database for information retrieval and storing.
- __MongoDB__: This will also be hosted on an EC2 Linux instance. It will host our database. It will be in a private subnet along with the application server fleet. It will interface with the application servers for information read and write.
- __Public and Private Subnets__: The VPC will be broken into different subnets. The public subnets will host the bastion server and the front end servers. The private subnets will host the application servers and database. This will provide an extra layer of security to our database and application servers.

### 4.2 MEAN Stack system design
![](https://i.imgur.com/BsiTCD5.png)

- __Stage 1__: At this stage, the user interacts with the angular application and makes requests through it.
- __Stage 2__: This is where the users request, which was sent from the angular application is parsed and passed on to expressjs.
- __Stage 3__: This is where the parsed request is handled. In most cases, the database will be queried. 
- __Stage 4__: At this stage, the result of the query is passed back to the express application. This is then returned back to the Node.JS Server
- __Stage 5__: The request is then returned back to the user.
- __Stage 6__: The response is displayed to the user.

Stages 1 to 6 are then repeated for the duration of the session.

---

# 5.High level design Diagrams

## 5.1 Signup and vote creation

![](https://i.imgur.com/7sMWNQg.png)

### 5.1.1 Description : 
#### Explanation for Fig 5.1
- ___Step 1 : Register / Signup___
 User creates an account on the website by going to sign-up page, this will give the the user the ability to log in.
- ___Step 2 : Log in___ 
 User logs in to the website with the account details provided at registration step.
- ___Step 3 : New vote___
 User navigates to the New Vote page from which the user is able to create a new vote.
- ___Step 4 : Configure Vote___
 User configures the vote by inputing vote options and configuring vote settings.
- ___Step 5 : Create Vote___
 User finalizes and creates the vote after which hes given a short shareable url for that specific vote which can be used to participate in that vote.
- ___Step 6.1 : Share vote link___
 User is able to share the link using social media and email.
- ___Step 6.2 : View vote statistics___
 User can go to statistics page of that specific vote.
- ___Step 6.3 : View vote results___
 User can view the results of that specific vote.




## 5.2 Signup, pgp key setup and secure vote participation
![](https://i.imgur.com/5KBd68s.png)

### 5.2.1 Description : 
#### Explanation for Fig 5.2
- ___Step 1 : / Signup___
 User creates an account on the website by going to sign-up page, choose to skip PGP setup at registration. This will give the the user the ability to log in.
- ___Step 2 : Log in___
 User logs in to the website with the account details provided at registration step.
- ___Step 3 : Account settings___
 User navigates to account settings where they change account details as well as setup PGP signing which is required to participate in secure votes.
- ___Step 4 : Setup PGP signing___
 User sets up PGP signing for their account which involves generate a new PGP key pair or uploading an existing public key.
- ___Step 5 : Go to Secure Vote___
 User goes to a secure vote voting page using a link shared to them.
- ___Step 6 : Cast secure vote___
 User casts a secure vote, to do this they're required to provide their PGP private key using which the vote will be signed and then verified using the public key stored on our servers.
- ___Step 7.1 : Share vote link___
 User is able to share the link using social media and email.
- ___Step 7.2 : View vote statistics___
 User can go to statistics page of that specific vote.
- ___Step 7.3 : View vote results___
 User can view the results of that specific vote.


## 5.3 Strawpoll vote participation (No account)
 ![](https://i.imgur.com/8PZFUFb.png)
### 5.3.1 Description : 
#### Explanation for Fig 5.3 
- ___Step 1 : Go to strawpoll vote___
 User goes to a strawpoll vote page using a shared link.
- ___Step 2 : Select vote options___
 User selects the option he wants to cast the vote on.
- ___Step 3 : Cast vote___
 User finalizes and casts the vote
- ___Step 4.1 : Share vote link___
 User is able to share the link using social media and email.
- ___Step 4.2 : View vote results___
 User can view the results of that specific vote.

---

# 6. Preliminary schedule
### 6.1 Overview
The below schedule was designed in LibreOffice Calc. It shows a full list of tasks and the dates we plan on completing each task. 

Each Task is assigned a duration, start and finish date and an assignee. 

With the nature of most software projects, we will probably drift from this and there is redundancy built in to give us time to do this. We plan to have a basic implementation by the time we return. And we aim to have all functions implemented by mid February. This gives us time for extensive testing and writing the manuals. 
### 6.2 Task List
![](https://i.imgur.com/KXTllyB.png)


---

# 7. Appendices
### 7.1 Appendix 1 - Resources
- AWS - [aws.amazon.com](https://aws.amazon.com)
- MongoDB - [mongodb.com](https://www.mongodob.com)
- Node.js - [nodejs.org](https://www.nodejs.org)
- Express.js - [expressjs.com](https://www.expressjs.com)
- Angular - [angular.io](https://www.angular.io)
### 7.2 Appendix 2 - References
- https://www.codingdojo.com/what-is-the-mean-stack
- https://scotch.io/tutorials/deploying-a-mean-app-to-amazon-ec2-part-1
- https://aws.amazon.com/architecture/well-architected/
- https://medium.com/xplenty-blog/the-sql-vs-nosql-difference-mysql-vs-mongodb-32c9980e67b2
- https://microservices.io/
