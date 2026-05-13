import type { Domain } from "../types/study";

export const domains: Domain[] = [
  {
    id: "cloud-concepts",
    title: "Cloud Concepts",
    examWeight: 24,
    description: "Why cloud exists, what value AWS provides, and how cloud design principles work.",
    topics: [
      {
        id: "shared-cloud-value",
        domainId: "cloud-concepts",
        title: "Cloud Value Proposition",
        summary: "Understand agility, elasticity, economies of scale, and moving from capital expense to variable expense.",
        lesson: {
          explanation: "Cloud computing lets you rent technology resources on demand instead of buying and maintaining all infrastructure yourself.",
          whyItMatters: "The exam often checks whether you understand business value, not only technical service names.",
          example: "A startup can launch servers today and reduce them tomorrow without buying physical machines.",
          commonConfusion: "Elasticity is matching capacity to demand; agility is how quickly teams can experiment and deliver.",
          howAwsTestsIt: "Expect questions asking which cloud benefit matches a scenario such as unpredictable traffic or global launch speed.",
        },
      },
      {
        id: "global-infrastructure",
        domainId: "cloud-concepts",
        title: "Global Infrastructure",
        summary: "Regions, Availability Zones, edge locations, and high availability.",
        lesson: {
          explanation: "AWS runs Regions around the world. Each Region has multiple Availability Zones, and edge locations bring content closer to users.",
          whyItMatters: "Global infrastructure explains availability, latency, disaster recovery, and data residency choices.",
          example: "Deploying across two Availability Zones helps an application survive a single data center failure.",
          commonConfusion: "An Availability Zone is not the same thing as a Region; a Region contains multiple Availability Zones.",
          howAwsTestsIt: "Expect questions about reducing latency, improving resilience, or choosing where data lives.",
        },
      },
      {
        id: "well-architected",
        domainId: "cloud-concepts",
        title: "AWS Well-Architected Framework",
        summary: "Learn the high-level pillars AWS uses to evaluate cloud workloads.",
        lesson: {
          explanation: "The Well-Architected Framework is AWS guidance for building secure, reliable, efficient, cost-aware, sustainable systems.",
          whyItMatters: "It gives you vocabulary for evaluating whether a workload is designed responsibly.",
          example: "Using multiple Availability Zones supports the reliability pillar.",
          commonConfusion: "It is guidance and best practice review, not a service that automatically fixes your architecture.",
          howAwsTestsIt: "Expect matching questions that connect a design concern to a pillar.",
        },
      },
    ],
  },
  {
    id: "security-compliance",
    title: "Security and Compliance",
    examWeight: 30,
    description: "Shared responsibility, IAM basics, compliance resources, and security best practices.",
    topics: [
      {
        id: "shared-responsibility",
        domainId: "security-compliance",
        title: "Shared Responsibility Model",
        summary: "Separate what AWS secures from what the customer must secure.",
        lesson: {
          explanation: "AWS is responsible for security of the cloud; customers are responsible for security in the cloud.",
          whyItMatters: "This is one of the most important Cloud Practitioner concepts.",
          example: "AWS secures physical data centers; you configure IAM permissions and protect data.",
          commonConfusion: "Managed services reduce customer work, but customers still manage data, access, and configuration.",
          howAwsTestsIt: "Expect scenario questions asking who is responsible for patching, access, encryption, or physical facilities.",
        },
      },
      {
        id: "iam-basics",
        domainId: "security-compliance",
        title: "IAM Basics",
        summary: "Users, groups, roles, policies, MFA, and root user best practices.",
        lesson: {
          explanation: "AWS IAM controls who can access AWS resources and what actions they can perform.",
          whyItMatters: "Most AWS accounts rely on IAM to apply least privilege.",
          example: "An EC2 instance can use an IAM role to access S3 without hard-coded credentials.",
          commonConfusion: "Roles are assumed temporarily; users represent identities with long-term credentials.",
          howAwsTestsIt: "Expect questions about least privilege, MFA, and when to use roles instead of users.",
        },
      },
      {
        id: "compliance-resources",
        domainId: "security-compliance",
        title: "Compliance Resources",
        summary: "AWS Artifact, compliance reports, and governance basics.",
        lesson: {
          explanation: "AWS provides compliance reports and agreements through services like AWS Artifact.",
          whyItMatters: "Cloud Practitioner questions often ask where to find audit and compliance documentation.",
          example: "A company can use AWS Artifact to access certain compliance reports.",
          commonConfusion: "AWS Artifact provides reports and agreements; it does not make your workload compliant by itself.",
          howAwsTestsIt: "Expect tool-selection questions for audit reports, agreements, and compliance documentation.",
        },
      },
    ],
  },
  {
    id: "technology-services",
    title: "Cloud Technology and Services",
    examWeight: 34,
    description: "Core AWS services for compute, storage, databases, networking, monitoring, and migration.",
    topics: [
      {
        id: "compute-basics",
        domainId: "technology-services",
        title: "Compute Basics",
        summary: "Understand EC2, Lambda, containers, and managed compute choices.",
        lesson: {
          explanation: "Compute services run application code, from virtual machines to serverless functions.",
          whyItMatters: "The exam checks whether you can choose the right compute model for a simple scenario.",
          example: "Use Lambda for event-driven code without managing servers; use EC2 when you need virtual machine control.",
          commonConfusion: "Serverless does not mean no servers exist; it means AWS manages the servers for you.",
          howAwsTestsIt: "Expect service-selection questions comparing EC2, Lambda, ECS, and Elastic Beanstalk.",
        },
      },
      {
        id: "storage-basics",
        domainId: "technology-services",
        title: "Storage Basics",
        summary: "Understand object, block, and file storage at a beginner level.",
        lesson: {
          explanation: "AWS storage services fit different access patterns: S3 for objects, EBS for block volumes, EFS for shared file storage.",
          whyItMatters: "Choosing the right storage type is a common beginner AWS skill.",
          example: "Use S3 for static website assets or backups, and EBS for an EC2 boot volume.",
          commonConfusion: "S3 is not a traditional file system even though it stores files as objects.",
          howAwsTestsIt: "Expect questions asking which service stores objects durably or attaches to EC2.",
        },
      },
      {
        id: "monitoring-networking",
        domainId: "technology-services",
        title: "Monitoring And Networking",
        summary: "CloudWatch, VPC basics, Route 53, and CloudFront.",
        lesson: {
          explanation: "Networking connects resources and users, while monitoring helps you observe performance, logs, alarms, and health.",
          whyItMatters: "Cloud Practitioner expects you to recognize foundational service responsibilities.",
          example: "Use CloudWatch alarms for metrics, Route 53 for DNS, and CloudFront for content delivery.",
          commonConfusion: "CloudFront is a content delivery network; Route 53 is DNS and domain routing.",
          howAwsTestsIt: "Expect questions that ask which service monitors metrics, routes DNS, or reduces latency with cached content.",
        },
      },
    ],
  },
  {
    id: "billing-support",
    title: "Billing, Pricing, and Support",
    examWeight: 12,
    description: "Pricing models, cost tools, AWS Free Tier, support plans, and Trusted Advisor.",
    topics: [
      {
        id: "pricing-basics",
        domainId: "billing-support",
        title: "Pricing Basics",
        summary: "Understand pay-as-you-go, reservations, savings plans, and Free Tier.",
        lesson: {
          explanation: "AWS pricing is based on consumption, with discounts available for commitment or specific usage patterns.",
          whyItMatters: "Cloud Practitioner expects cost awareness and basic pricing vocabulary.",
          example: "Savings Plans can reduce cost when compute usage is predictable.",
          commonConfusion: "Free Tier does not mean every AWS service is free forever.",
          howAwsTestsIt: "Expect questions about matching cost tools or pricing models to a scenario.",
        },
      },
      {
        id: "support-tools",
        domainId: "billing-support",
        title: "Support Tools",
        summary: "Understand AWS Budgets, Cost Explorer, Trusted Advisor, and support plans.",
        lesson: {
          explanation: "AWS provides tools to monitor cost, forecast spend, and receive support based on plan level.",
          whyItMatters: "The exam checks whether you know which tool helps with budgets, reports, or recommendations.",
          example: "Use AWS Budgets to alert when forecasted spend exceeds a threshold.",
          commonConfusion: "Cost Explorer analyzes spend; Budgets alerts against thresholds.",
          howAwsTestsIt: "Expect questions asking which billing or support tool solves a specific business need.",
        },
      },
      {
        id: "trusted-advisor",
        domainId: "billing-support",
        title: "AWS Trusted Advisor",
        summary: "Recommendations for cost, security, performance, reliability, and service limits.",
        lesson: {
          explanation: "Trusted Advisor checks your AWS environment and recommends improvements across key best-practice categories.",
          whyItMatters: "It connects billing, support, operations, and security recommendations.",
          example: "Trusted Advisor may point out underused resources or security settings that need attention.",
          commonConfusion: "Trusted Advisor gives recommendations; it is not the same as a human AWS Support engineer.",
          howAwsTestsIt: "Expect questions asking which service provides account-level best-practice recommendations.",
        },
      },
    ],
  },
];

export function getDomainTitle(domainId: Domain["id"]) {
  return domains.find((domain) => domain.id === domainId)?.title ?? domainId;
}
