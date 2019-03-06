# Elect Technical Manual

## 0 - Table of Contents

1. Introduction
   - 1.1 - Overview
   - 1.2 - Glossary

2. System Architecture
   - 2.1 - Languages Choices
   - 2.2 - System Architecture
3. High-Level Design
   - 3.1 Initial Design
   - 3.2 Current Design
4. Problems and resolution

5. Installation Guide

6. Testing

## 1 - Introduction

### 1.1 - Overview

---

> The idea for this project came about after this years Redbrick EGM, we noticed a problem. When people were voting to elect new committee members, all the votes had to be written on paper then tallied up. This was a long and arduous process to sit through. We assume Redbrick are not the only society which face this issue.
>
> We propose a system that will combat this problem. The premise of this web application is to allow clubs, societies, groups and organisations to carry out votes for elections. Users who wish to conduct a vote or election will also have the option to digitally sign the votes, giving them peace of mind that whoever said they voted, did. Once a vote is created, the creator is given a unique, shareable url that may be distributed to whoever they wish to participate in the vote. Results will be available to voters and statistics available to the poll creators in the form of charts and graphs. 
>
> You can think of this as the Doodle for voting and elections.

### 1.2 - Glossary

---

- __MongoDB__: MongoDB is a free open-source cross-platform document-oriented database program. Classified as a NoSQL database program, MongoDB uses JSON-like documents with schemata.

- __Angular__: Angular is a TypeScript based open-source front-end web application platform.

- __TypeScript__: TypeScript is an open-source programming language developed and maintained by Microsoft. It is a strict syntactical superset of Javascript, and adds optional static typing to the language.

- __Node.JS__: Node.JS is an open-source, cross-platform JavaScript run-time environment that executes JavaScript code outside of a browser. Node.JS allows developers use JavaScript to write command line tools and server-side scripts.

- __Express.JS__: Express.js is an open source web application framework for Node.js. It is designed for building we applications and APIs.

- __HTML__: Hypertext Markup Language is the authoring language used to create documents on the web.

- __Bootstrap__: Bootstrap is an open source front end framework for websites and web applications.

- __AWS__: AWS (Amazon Web Services) is Amazon's cloud computing platform. It provides on-demand, elastic computing services to organizations and individuals.

- __VPC__: VPC (Virtual Private Cloud) is "Your own data center in the cloud". VPC lets you provision a logically isolated section of the AWS Cloud where you can launch AWS resources in a virtual network that you define. VPC provides complete control over your virtual networking environment, including selection of your own IP address range, creation of subnets, and configuration of route tables and network gateways.

- __EC2__: AWS Elastic Compute Cloud (EC2) is a web service that provides secure, resizable compute capacity in the cloud.

- __OpenPGP__: Open PGP is an open source implementation of PGP. Pretty Good Privacy (PGP) is an encryption program that provides cryptographic privacy and authentication for data communication. PGP is used for signing, encrypting, and decrypting texts, e-mails, files, directories, and whole disk partitions and to increase the security of e-mail communications. This is under RFC 4880

- __Digital Signatures__: A digital signature is a mathematical scheme for verifying the authenticity of digital messages or documents.