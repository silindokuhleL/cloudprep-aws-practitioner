# CloudPrep - AWS Cloud Practitioner Study Demo

CloudPrep is a guided study demo for the AWS Certified Cloud Practitioner CLF-C02 exam. It helps a learner understand AWS concepts, practise original questions, review mistakes, track skill growth, and decide when they may be ready for the real exam.

## Study Structure

The app follows the official CLF-C02 exam domains:

- Cloud Concepts: 24%
- Security and Compliance: 30%
- Cloud Technology and Services: 34%
- Billing, Pricing, and Support: 12%

Official AWS guide: https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02.html

## Features

- Guided dashboard with today's recommended study action.
- Plain-English lessons by domain and topic.
- Original practice questions with explanations for correct and wrong answers.
- Mistake review for incorrect or uncertain answers.
- Skill tracker with domain states: new, weak, improving, strong.
- Mini mock exam mode with domain score breakdown.
- Exam readiness summary with a cautious checklist.

## Important Exam Content Note

The questions in this project are original practice questions. They are not real AWS exam questions and should not be treated as exam dumps.

## Setup

```bash
npm install
npm run dev -- --port 3105
```

Open:

```text
http://127.0.0.1:3105
```

## Verification

```bash
npm run test
npm run build
```
