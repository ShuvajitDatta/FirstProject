import React, { useState, useEffect, useMemo, useRef } from "react";

// ============================================================
// IBM C1000-141 — IBM Maximo Manage v8.x Administrator
// Practice Exam Application
//
// Section distribution per real exam (67 questions total):
//   S1: 11 | S2: 9 | S3: 11 | S4: 7 | S5: 12 | S6: 10 | S7: 7
// Passing score: 71% (48 / 67)
// ============================================================

const SECTION_META = {
  1: { name: "Administer a Maximo Manage Environment", count: 11 },
  2: { name: "Security",                                count: 9  },
  3: { name: "System Configuration",                    count: 11 },
  4: { name: "Process Automation",                      count: 7  },
  5: { name: "Maximo Manage Configuration",             count: 12 },
  6: { name: "Troubleshooting",                         count: 10 },
  7: { name: "Integration",                             count: 7  },
};

// ------------------------------------------------------------
// QUESTION POOL
// type: "single" (1 correct) or "multi" (2+ correct)
// answer: string for single, array for multi
// ------------------------------------------------------------
const QUESTIONS = [
  // ============================================================
  // SECTION 1 — Administer a Maximo Manage Environment
  // ============================================================
  { id: "S1-01", section: 1, type: "single",
    q: "When deploying Maximo Manage, how many server bundles can be added with the same bundle type?",
    options: { A: "five", B: "one", C: "two", D: "unlimited" }, answer: "B" },

  { id: "S1-02", section: 1, type: "multi",
    q: "When Edit Mode is enabled and a Work Order is locked, which two methods will release the lock?",
    options: {
      A: "saving changes to the record",
      B: "returning to the List tab of the application",
      C: "opening another application by using the Go To menu",
      D: "running a report from the left Action menu or toolbar",
      E: "applying the Clear Changes option from the left Action menu",
    },
    answer: ["B", "C"] },

  { id: "S1-03", section: 1, type: "single",
    q: "Which platform is Maximo Application Suite (MAS) deployed on?",
    options: { A: "WebSphere Application Server only", B: "Red Hat OpenShift Container Platform",
               C: "Bare-metal Linux servers", D: "Microsoft Azure VMs only" }, answer: "B" },

  { id: "S1-04", section: 1, type: "single",
    q: "What is the role of the IBM Entitled Registry in a MAS deployment?",
    options: {
      A: "It stores Maximo work order data.",
      B: "It is the source for IBM container images required to deploy MAS.",
      C: "It manages user licenses on the Manage UI.",
      D: "It tracks which BIRT reports have been generated.",
    }, answer: "B" },

  { id: "S1-05", section: 1, type: "single",
    q: "What is the purpose of the MAS Manage customization library?",
    options: {
      A: "To store backup copies of the Maximo database.",
      B: "To hold customization archive files (such as product extensions and custom code) that are applied during a Manage build.",
      C: "To replace the need for the Database Configuration application.",
      D: "To dynamically translate the UI in real time.",
    }, answer: "B" },

  { id: "S1-06", section: 1, type: "single",
    q: "How are changes from the customization library applied to a running Manage workspace?",
    options: {
      A: "They are applied immediately at runtime without any build.",
      B: "By updating Manage and triggering a new build of the Manage component.",
      C: "By restarting only the Maximo database pod.",
      D: "By manually copying files into the running pod.",
    }, answer: "B" },

  { id: "S1-07", section: 1, type: "multi",
    q: "Which two are valid Maximo Manage server bundle types?",
    options: { A: "UI", B: "REPORT", C: "CRON", D: "DBLOAD", E: "AUDIT" },
    answer: ["A", "C"] },

  { id: "S1-08", section: 1, type: "single",
    q: "What is the primary advantage of performing a rolling restart of Maximo Manage instead of a full restart?",
    options: {
      A: "It clears all caches more aggressively.",
      B: "It avoids downtime by restarting pods one at a time so the system stays available.",
      C: "It is the only way to reload security groups.",
      D: "It automatically rebuilds the database indexes.",
    }, answer: "B" },

  { id: "S1-09", section: 1, type: "single",
    q: "Where can an administrator obtain information about users currently connected to Maximo Manage?",
    options: {
      A: "Logging application",
      B: "Users application — Manage Sessions action",
      C: "Database Configuration application",
      D: "Domains application",
    }, answer: "B" },

  { id: "S1-10", section: 1, type: "single",
    q: "Which application allows an administrator to review or delete saved queries that were created by users?",
    options: {
      A: "Application Designer",
      B: "Database Configuration",
      C: "the application where the query was saved (Manage Queries action)",
      D: "Workflow Designer",
    }, answer: "C" },

  { id: "S1-11", section: 1, type: "single",
    q: "Which Maximo Manage application is used to register, import, or preview BIRT report files?",
    options: { A: "Logging", B: "Report Administration", C: "Communication Templates",
               D: "Object Structures" }, answer: "B" },

  { id: "S1-12", section: 1, type: "single",
    q: "What is the recommended way to update database statistics for a Maximo Manage table?",
    options: {
      A: "Re-import the database from backup.",
      B: "Use the Update Statistics action in Database Configuration.",
      C: "Restart the entire MAS cluster.",
      D: "Drop and re-create the table.",
    }, answer: "B" },

  { id: "S1-13", section: 1, type: "single",
    q: "When do administrators need to renew or reimport certificates in MAS?",
    options: {
      A: "Only when the database password changes.",
      B: "When TLS certificates approach expiry, or when integrating with new external endpoints (LDAP, SMTP, etc.).",
      C: "Only when changing the workspace name.",
      D: "Never — certificates are auto-rotated weekly.",
    }, answer: "B" },

  { id: "S1-14", section: 1, type: "single",
    q: "How is a language pack applied to a Maximo Manage workspace?",
    options: {
      A: "By installing the language pack via the Manage component channel and selecting the language(s) for the workspace; Manage is then re-built/updated.",
      B: "By manually editing the maximo.properties file on the database server.",
      C: "By running the BIRT translator cron task.",
      D: "Language packs are installed only at the database level.",
    }, answer: "A" },

  { id: "S1-15", section: 1, type: "multi",
    q: "Which two server bundle types are commonly scaled up to improve performance for heavy user load and scheduled jobs respectively?",
    options: { A: "UI", B: "CRON", C: "MEA only", D: "REPORT only", E: "AUDIT" },
    answer: ["A", "B"] },

  { id: "S1-16", section: 1, type: "single",
    q: "Where in Red Hat OpenShift can an administrator monitor pod CPU/memory usage and pod status for Maximo Manage?",
    options: {
      A: "Database Configuration application",
      B: "OpenShift web console — Workloads / Observe (Monitoring) view",
      C: "Maximo Logging application",
      D: "Maximo Start Center",
    }, answer: "B" },

  { id: "S1-17", section: 1, type: "single",
    q: "Edit Mode is enabled and a record is locked by another user. As an administrator, where can the lock be cleared?",
    options: {
      A: "Database Configuration — Manage Admin Mode",
      B: "Edit Mode Admin in the Administration Work Center / Edit Mode application — Release Locks action",
      C: "Application Designer",
      D: "Domains application",
    }, answer: "B" },

  { id: "S1-18", section: 1, type: "single",
    q: "Which statement best describes scaling server bundles in Maximo Manage?",
    options: {
      A: "Each bundle type can have multiple replicas (pods) to distribute the workload.",
      B: "Only the UI bundle can be scaled.",
      C: "Bundle scaling requires a database restart.",
      D: "Bundle scaling is only available in the on-premises (WebSphere) deployment.",
    }, answer: "A" },

  { id: "S1-19", section: 1, type: "single",
    q: "What does the All bundle type provide in a Maximo Manage deployment?",
    options: {
      A: "It only handles cron tasks.",
      B: "It runs all server functions (UI, cron, MEA, report) in a single bundle, useful for small environments.",
      C: "It is required to license the product.",
      D: "It only handles BIRT report generation.",
    }, answer: "B" },

  { id: "S1-20", section: 1, type: "single",
    q: "Which application is the correct place to update database indexes for performance tuning?",
    options: {
      A: "Database Configuration — Configure Database / index management",
      B: "Application Designer",
      C: "Workflow Designer",
      D: "Communication Templates",
    }, answer: "A" },

  { id: "S1-21", section: 1, type: "single",
    q: "An administrator needs to apply a Manage update (PTF / fix). What is the correct high-level process?",
    options: {
      A: "Edit code directly in production pods.",
      B: "Update the Manage channel/version in the MAS UI, then trigger an Update of the Manage component which builds and deploys new pods.",
      C: "Restart the database server only.",
      D: "Apply the update inside the WebSphere Admin Console.",
    }, answer: "B" },

  { id: "S1-22", section: 1, type: "single",
    q: "Which file holds key startup properties (such as mxe.db.url) used by Maximo Manage server bundles?",
    options: { A: "maximo.properties", B: "web.xml", C: "rmregistry.dat", D: "actuate.cfg" },
    answer: "A" },

  { id: "S1-23", section: 1, type: "single",
    q: "BIRT report scheduling and queue monitoring is best performed in which application?",
    options: { A: "Report Administration", B: "Domains", C: "Object Structures", D: "Cron Task Setup" },
    answer: "A" },

  { id: "S1-24", section: 1, type: "single",
    q: "What is the recommended approach to handle user-uploaded customizations (XML, class files) in MAS Manage?",
    options: {
      A: "Place them on the database server file system.",
      B: "Add them to the customization archive and reference it via the Manage workspace customization library.",
      C: "Email them to IBM Support.",
      D: "Save them in the local browser cache.",
    }, answer: "B" },

  { id: "S1-25", section: 1, type: "single",
    q: "Which feature lets an administrator monitor real-time CPU and memory health of Manage pods directly inside MAS?",
    options: {
      A: "Maximo Activity Dashboard / OpenShift monitoring views",
      B: "Domains application",
      C: "Workflow Designer",
      D: "Communication Templates",
    }, answer: "A" },

  { id: "S1-26", section: 1, type: "single",
    q: "The default behavior when a record is locked in Edit Mode and the user closes the browser without saving is:",
    options: {
      A: "The lock is released automatically the moment the browser closes.",
      B: "The lock stays until it times out, or an administrator releases it via Edit Mode admin.",
      C: "The lock is escalated to all other users.",
      D: "The record is automatically deleted.",
    }, answer: "B" },

  { id: "S1-27", section: 1, type: "single",
    q: "Where are MAS Manage workspace settings (such as activated languages and base language) configured?",
    options: {
      A: "MAS workspace configuration UI for the Manage component",
      B: "Maximo Domains application",
      C: "WebSphere Admin Console",
      D: "OpenShift cron schedule",
    }, answer: "A" },

  { id: "S1-28", section: 1, type: "single",
    q: "Which action best describes what happens during a 'rolling restart' of Manage?",
    options: {
      A: "All pods are stopped and started simultaneously.",
      B: "Pods are restarted one at a time so users keep working without an outage.",
      C: "The database is restarted.",
      D: "Only the UI bundle is restarted.",
    }, answer: "B" },

  // ============================================================
  // SECTION 2 — Security
  // ============================================================
  { id: "S2-01", section: 2, type: "single",
    q: "Where can E-Signature Key requirements (e.g., minimum length) be set?",
    options: {
      A: "the E-Signature settings in the Organization application",
      B: "the Security Controls action in the Security Groups application",
      C: "by configuring API Key settings in the Administration Work Center",
      D: "the Password Criteria settings in the Database Configuration application",
    }, answer: "B" },

  { id: "S2-02", section: 2, type: "single",
    q: "A user belongs to two security groups: one has a qualified data restriction on the Asset Object while the other grants full access to the Asset application. Which behavior will the user experience?",
    options: {
      A: "The user will have full access to the Asset data.",
      B: "The user will have restricted access to the Asset data.",
      C: "The user will only experience the data restriction in the Work Center applications.",
      D: "The user will be able to view all Asset records but will only be able to edit those not included in the qualified data restriction.",
    }, answer: "B" },

  { id: "S2-03", section: 2, type: "single",
    q: "Which statement describes a function of the Work Center Authorization Template in the Security Groups application?",
    options: {
      A: "Creates new Work Centers.",
      B: "Revokes Work Center access.",
      C: "Removes access to applications.",
      D: "Applies access to the identified Object Structures.",
    }, answer: "D" },

  { id: "S2-04", section: 2, type: "single",
    q: "Where is LDAP synchronization defined and configured in MAS Manage?",
    options: {
      A: "LDAPSYNC cron task in the Cron Task Setup application of Maximo Manage",
      B: "Maximo Database Configuration application",
      C: "Domains application",
      D: "Workflow Designer",
    }, answer: "A" },

  { id: "S2-05", section: 2, type: "single",
    q: "Where are new users typically added in a MAS environment so they can be entitled to Manage?",
    options: {
      A: "MAS Suite Administration / Suite Users (the MAS level)",
      B: "Inside an Object Structure",
      C: "Workflow Designer",
      D: "Database Configuration",
    }, answer: "A" },

  { id: "S2-06", section: 2, type: "single",
    q: "Which best describes the difference between a Person Group and a Security Group?",
    options: {
      A: "Person Groups grant application authorization; Security Groups are for assignment routing.",
      B: "Person Groups are used for assignment, ownership, and routing; Security Groups grant application and data authorization.",
      C: "They are the same; the names are interchangeable.",
      D: "Person Groups can only contain crafts.",
    }, answer: "B" },

  { id: "S2-07", section: 2, type: "single",
    q: "Where is a qualified data restriction (with a SQL where clause) configured?",
    options: {
      A: "Application Designer",
      B: "Security Groups — Data Restrictions tab — Object Restrictions / Attribute Restrictions",
      C: "Database Configuration — Add Index",
      D: "Workflow Designer",
    }, answer: "B" },

  { id: "S2-08", section: 2, type: "single",
    q: "Which application is used to grant or remove access to specific Object Structures used for integration or reporting?",
    options: { A: "Object Structures application — Authorize Object Structure Security action",
               B: "Workflow Designer", C: "Communication Templates", D: "Domains" }, answer: "A" },

  { id: "S2-09", section: 2, type: "single",
    q: "When a user is in two security groups, how does Manage usually combine application authorizations?",
    options: {
      A: "Authorizations are subtracted; the most restrictive one wins.",
      B: "Application authorizations are additive (union of granted privileges).",
      C: "Only the first group joined applies.",
      D: "Authorizations are random per session.",
    }, answer: "B" },

  { id: "S2-10", section: 2, type: "multi",
    q: "Which two are types of data restrictions that can be defined in the Security Groups application?",
    options: { A: "Object", B: "Attribute", C: "Bundle", D: "Workspace", E: "Report Variable" },
    answer: ["A", "B"] },

  { id: "S2-11", section: 2, type: "single",
    q: "Where in Manage do you grant a security group the right to view and run a specific report?",
    options: {
      A: "Security Groups — Reports tab (or via Report Administration's Set Security)",
      B: "Application Designer",
      C: "Workflow Designer",
      D: "Cron Task Setup",
    }, answer: "A" },

  { id: "S2-12", section: 2, type: "single",
    q: "Which user profile setting determines the default Insert Site (the Site context in which the user creates new records)?",
    options: {
      A: "Default Insert Site on the user's record in the Users application",
      B: "Domains application",
      C: "System Properties",
      D: "Security Controls only",
    }, answer: "A" },

  { id: "S2-13", section: 2, type: "single",
    q: "An administrator wants ALL users to authenticate against the corporate directory. Which mode should be configured?",
    options: {
      A: "Database authentication only",
      B: "LDAP / SSO via the MAS authentication setup (e.g., SAML, OIDC), with LDAPSYNC for user attributes",
      C: "Allow guest access globally",
      D: "Manual sign-up via Start Center",
    }, answer: "B" },

  { id: "S2-14", section: 2, type: "single",
    q: "What is the purpose of Security Controls in the Security Groups application?",
    options: {
      A: "To define global security parameters such as password / e-signature requirements, login attempts and lockout policy.",
      B: "To rebuild database indexes.",
      C: "To translate field labels.",
      D: "To run the Integrity Checker.",
    }, answer: "A" },

  { id: "S2-15", section: 2, type: "single",
    q: "Which statement is true about the 'independent of other groups' setting on a Security Group?",
    options: {
      A: "Privileges in this group are NOT combined with other groups for the user — the group operates independently.",
      B: "It causes the group to be deleted on logout.",
      C: "It blocks the user from logging in.",
      D: "It forces all users into Edit Mode.",
    }, answer: "A" },

  { id: "S2-16", section: 2, type: "single",
    q: "Which application is used to assign which sites a user can access?",
    options: {
      A: "Users application — Site authorization, via Security Group site authorizations",
      B: "Workflow Designer",
      C: "Communication Templates",
      D: "Domains",
    }, answer: "A" },

  { id: "S2-17", section: 2, type: "single",
    q: "What is the role of the LDAPSYNC cron task?",
    options: {
      A: "It synchronizes user records and group memberships from an LDAP directory into Manage.",
      B: "It only logs failed logins.",
      C: "It encrypts the maxuser table.",
      D: "It rebuilds search indexes.",
    }, answer: "A" },

  { id: "S2-18", section: 2, type: "single",
    q: "Where do you configure which Work Centers a security group can access?",
    options: {
      A: "Security Groups — Work Centers tab (and the Work Center Authorization Template)",
      B: "Application Designer",
      C: "Database Configuration",
      D: "Domains",
    }, answer: "A" },

  { id: "S2-19", section: 2, type: "single",
    q: "Which is true about reporting object structure security?",
    options: {
      A: "Reports use object structure authorization to determine which records are returned for the user.",
      B: "Reports bypass all security.",
      C: "Reports can only be viewed by administrators.",
      D: "Reporting object structure security is only used by integration.",
    }, answer: "A" },

  { id: "S2-20", section: 2, type: "single",
    q: "Which option correctly describes a 'conditional' data restriction?",
    options: {
      A: "A restriction that is applied based on a defined condition (such as a Conditional Expression) at runtime.",
      B: "A restriction limited to chart-of-accounts only.",
      C: "A restriction that disables passwords.",
      D: "A restriction enforced only for guest users.",
    }, answer: "A" },

  { id: "S2-21", section: 2, type: "single",
    q: "An administrator wants to ensure passwords expire every 90 days. Where is this configured?",
    options: {
      A: "Security Groups application — Security Controls action — Password Settings",
      B: "Domains",
      C: "Workflow Designer",
      D: "Application Designer",
    }, answer: "A" },

  { id: "S2-22", section: 2, type: "single",
    q: "Which is the correct location to grant a user 'Read' access to specific applications?",
    options: {
      A: "Security Groups — Applications tab — Options for that app (e.g., Read, Save, Insert, Delete)",
      B: "Domains application",
      C: "Database Configuration",
      D: "Cron Task Setup",
    }, answer: "A" },

  // ============================================================
  // SECTION 3 — System Configuration
  // ============================================================
  { id: "S3-01", section: 3, type: "multi",
    q: "Using the Database Configuration application, which two methods can be used to add a View definition to Maximo after adding a new Object and setting it as a View?",
    options: {
      A: "import a saved query",
      B: "set it for report mode",
      C: "set it to dynamic access",
      D: "specify the SQL where clause",
      E: "import an existing database view",
    }, answer: ["D", "E"] },

  { id: "S3-02", section: 3, type: "single",
    q: "How does language support functionality work in Maximo Manage?",
    options: {
      A: "A translation application is used to provide translations.",
      B: "An additional table (the L_ language table) holds translated information for each translatable attribute.",
      C: "A translation cron task is provided with the language pack that translates the data.",
      D: "Real-time translation runs through Watson Language Translator.",
    }, answer: "B" },

  { id: "S3-03", section: 3, type: "single",
    q: "What must an Attribute be in order for it to be audit enabled?",
    options: { A: "Required", B: "Persistent", C: "User Defined", D: "Non-persistent" }, answer: "B" },

  { id: "S3-04", section: 3, type: "single",
    q: "Which type of domain is attached to the STATUS attribute of the Work Order Tracking application?",
    options: { A: "ALN Domain", B: "Table Domain", C: "Synonym Domain", D: "Crossover Domain" }, answer: "C" },

  { id: "S3-05", section: 3, type: "single",
    q: "What is a Lookup Map used for in Maximo Manage?",
    options: {
      A: "It defines source-to-target field mappings used when a value is selected from a lookup, so multiple fields are populated together.",
      B: "It is a chart of physical locations.",
      C: "It controls escalations.",
      D: "It manages BIRT report parameters.",
    }, answer: "A" },

  { id: "S3-06", section: 3, type: "single",
    q: "Which application is used to create a calculated formula on a numeric attribute?",
    options: {
      A: "Database Configuration — Attributes — Advanced Expression / Formula",
      B: "Workflow Designer",
      C: "Domains",
      D: "Cron Task Setup",
    }, answer: "A" },

  { id: "S3-07", section: 3, type: "single",
    q: "What is the purpose of the Configure Database action in Database Configuration?",
    options: {
      A: "It applies the pending object/attribute changes to the underlying database.",
      B: "It deletes the workflow records.",
      C: "It clears all logs.",
      D: "It refreshes the BIRT cache.",
    }, answer: "A" },

  { id: "S3-08", section: 3, type: "single",
    q: "Which Maximo Manage application is used to define a relationship between two business objects?",
    options: { A: "Database Configuration — Relationships tab on the parent Object",
               B: "Application Designer", C: "Workflow Designer", D: "Domains" }, answer: "A" },

  { id: "S3-09", section: 3, type: "single",
    q: "Where can E-Audit be enabled for an attribute (so changes are tracked in an audit table)?",
    options: {
      A: "Database Configuration — the attribute — set Auditing on the object and enable Audit on the attribute",
      B: "Application Designer",
      C: "Domains",
      D: "Workflow Designer",
    }, answer: "A" },

  { id: "S3-10", section: 3, type: "single",
    q: "Which domain type allows a one-way mapping of values between objects (for example, populating multiple fields from another record)?",
    options: { A: "Crossover Domain", B: "ALN Domain", C: "Numeric Range Domain", D: "Synonym Domain" }, answer: "A" },

  { id: "S3-11", section: 3, type: "single",
    q: "Which application allows updating system properties such as mxe.usermonitor or mxe.email.from?",
    options: { A: "System Properties", B: "Domains", C: "Database Configuration", D: "Application Designer" }, answer: "A" },

  { id: "S3-12", section: 3, type: "single",
    q: "Which application is used to set the schedule (run / do not run) of a cron task?",
    options: {
      A: "Cron Task Setup",
      B: "Database Configuration",
      C: "Workflow Designer",
      D: "Application Designer",
    }, answer: "A" },

  { id: "S3-13", section: 3, type: "single",
    q: "Where is the E-mail Listener configured in Maximo Manage?",
    options: { A: "E-mail Listeners application", B: "Application Designer", C: "Domains", D: "Cron Task Setup" }, answer: "A" },

  { id: "S3-14", section: 3, type: "single",
    q: "Which application is used to package configuration changes for migration between Maximo environments (Dev → Test → Prod)?",
    options: { A: "Migration Manager", B: "Workflow Designer", C: "Communication Templates", D: "Domains" },
    answer: "A" },

  { id: "S3-15", section: 3, type: "single",
    q: "The Maximo Manage geographical map feature is enabled at which level?",
    options: {
      A: "System Properties (mxe.map.* properties) and Application configuration",
      B: "Inside the user's password",
      C: "Workflow Designer only",
      D: "It is enabled by default and not configurable.",
    }, answer: "A" },

  { id: "S3-16", section: 3, type: "single",
    q: "What is the difference between an ALN domain and a Synonym domain?",
    options: {
      A: "ALN domains hold simple lists of allowed values; Synonym domains map external values to internal codes used by application logic.",
      B: "There is no difference.",
      C: "Synonym domains are only used in Asset Management.",
      D: "ALN domains can only have numeric values.",
    }, answer: "A" },

  { id: "S3-17", section: 3, type: "multi",
    q: "Which two are valid domain types in Maximo Manage?",
    options: { A: "Numeric Range", B: "Crossover", C: "Workflow", D: "Inspection", E: "Bundle" },
    answer: ["A", "B"] },

  { id: "S3-18", section: 3, type: "single",
    q: "When you add a new persistent attribute to an existing object, what must be done before users can use it?",
    options: {
      A: "Configure the Database to apply the change, then add the field to the application's UI in Application Designer.",
      B: "Restart the database server.",
      C: "Nothing — it appears automatically everywhere.",
      D: "Re-import the workflow.",
    }, answer: "A" },

  { id: "S3-19", section: 3, type: "single",
    q: "Which field on a cron task instance allows you to schedule it (e.g., every 5 minutes)?",
    options: { A: "Schedule", B: "Owner", C: "Run as user", D: "Reload" }, answer: "A" },

  { id: "S3-20", section: 3, type: "single",
    q: "What is the role of the 'Reload Request' on a cron task?",
    options: {
      A: "It signals running cron task instances to reload their configuration without restarting Manage.",
      B: "It deletes the cron task.",
      C: "It rebuilds the database indexes.",
      D: "It changes the user password.",
    }, answer: "A" },

  { id: "S3-21", section: 3, type: "single",
    q: "Where is e-signature for a particular action or attribute configured?",
    options: {
      A: "Database Configuration — attribute properties (E-signature Enabled) and the Application Designer to bind the signature option to an action",
      B: "Workflow Designer only",
      C: "Domains",
      D: "Communication Templates",
    }, answer: "A" },

  { id: "S3-22", section: 3, type: "single",
    q: "Which type of object should be created in Database Configuration when you only need a query view (no inserts/updates) on existing tables?",
    options: { A: "View", B: "Table", C: "Index", D: "Sequence" }, answer: "A" },

  { id: "S3-23", section: 3, type: "single",
    q: "How is a new attribute on an object made user-editable from a UI?",
    options: {
      A: "Configure the database, then add the attribute to the appropriate application in Application Designer.",
      B: "It becomes editable automatically once added.",
      C: "It must be added in Workflow Designer.",
      D: "Run the Integrity Checker only.",
    }, answer: "A" },

  { id: "S3-24", section: 3, type: "single",
    q: "When is the Integrity Checker typically run during configuration changes?",
    options: {
      A: "Before configuring the database with major object/attribute changes (and after critical updates) to confirm no inconsistencies.",
      B: "Only on Sundays.",
      C: "Only if BIRT reports fail.",
      D: "After every login.",
    }, answer: "A" },

  { id: "S3-25", section: 3, type: "single",
    q: "Which application stores translated UI strings via the L_ language table approach?",
    options: {
      A: "All applications use the L_ language table mechanism for translatable attributes; translations are loaded by language pack.",
      B: "Only the Workflow Designer.",
      C: "Only Communication Templates.",
      D: "None — translations are stored in the maximo.properties file.",
    }, answer: "A" },

  { id: "S3-26", section: 3, type: "single",
    q: "What is true about Migration Manager packages?",
    options: {
      A: "They can be created from migration collections, distributed, and deployed to a target environment.",
      B: "They can only be exported manually as XML.",
      C: "They cannot be used between databases of the same version.",
      D: "They only handle BIRT reports.",
    }, answer: "A" },

  { id: "S3-27", section: 3, type: "single",
    q: "Where do you change the default value of an attribute (e.g., a status defaulting to NEW)?",
    options: {
      A: "Database Configuration — Attribute properties — Default Value",
      B: "Workflow Designer",
      C: "Application Designer XML only",
      D: "Domains",
    }, answer: "A" },

  { id: "S3-28", section: 3, type: "single",
    q: "Which is a typical use of a TABLE domain?",
    options: {
      A: "Restricting an attribute to values that exist in another table (with optional where clause).",
      B: "Mapping external strings to internal synonyms.",
      C: "Setting numeric ranges.",
      D: "Enabling audit logging.",
    }, answer: "A" },

  // ============================================================
  // SECTION 4 — Process Automation
  // ============================================================
  { id: "S4-01", section: 4, type: "single",
    q: "How can an existing action be added to an Inspection Form?",
    options: {
      A: "using the Add Actions button from the Form Settings dialog in the Manage Inspection Forms menu",
      B: "in the Automation Scripts application, Action Launchpoint, specify the Inspection Form for the Action",
      C: "navigate to the Design Data Sets Work Center, select the MXAPIINSPFORM Object Structure and add an Action Definition",
      D: "from the Actions application, select an Inspection type Action and populate the Inspection Form name in the Value field",
    }, answer: "A" },

  { id: "S4-02", section: 4, type: "single",
    q: "Which Workflow node can be processed without user intervention?",
    options: { A: "Task", B: "Condition", C: "Interaction", D: "Manual Input" }, answer: "B" },

  { id: "S4-03", section: 4, type: "multi",
    q: "Which three Workflow nodes require user involvement?",
    options: { A: "Stop", B: "Wait", C: "Task", D: "Subprocess", E: "Interaction", F: "Manual Input" },
    answer: ["C", "E", "F"] },

  { id: "S4-04", section: 4, type: "single",
    q: "Which action is available in Workflow Administration?",
    options: {
      A: "Update the process revision",
      B: "Update the record field values",
      C: "Reassign the task to another user",
      D: "Add new user to the Workflow process",
    }, answer: "C" },

  { id: "S4-05", section: 4, type: "single",
    q: "What is the role of an Escalation in Maximo Manage?",
    options: {
      A: "It is a scheduled engine that finds records matching a condition and triggers actions or notifications.",
      B: "It only escalates passwords.",
      C: "It is used to back up the database.",
      D: "It is the audit table.",
    }, answer: "A" },

  { id: "S4-06", section: 4, type: "single",
    q: "Which application is used to define re-usable email message templates with substitution variables?",
    options: { A: "Communication Templates", B: "Domains", C: "Workflow Designer", D: "Application Designer" }, answer: "A" },

  { id: "S4-07", section: 4, type: "single",
    q: "How is a notification sent automatically when a workflow reaches an assignment node?",
    options: {
      A: "By configuring a notification (with a Communication Template) on the Task / Assignment node.",
      B: "By manually emailing each assignee.",
      C: "By importing a SQL trigger.",
      D: "It is not possible to send notifications from a workflow.",
    }, answer: "A" },

  { id: "S4-08", section: 4, type: "single",
    q: "Which is the recommended way to launch logic when a record is saved?",
    options: {
      A: "An automation script with an Object Launch Point (Save event)",
      B: "Modifying the maximo.properties file",
      C: "Editing the JVM",
      D: "Creating a manual report",
    }, answer: "A" },

  { id: "S4-09", section: 4, type: "single",
    q: "An Escalation has a schedule of '0 0 8 ? * MON-FRI'. What does it mean?",
    options: {
      A: "Run at 08:00 every weekday (Monday through Friday).",
      B: "Run only once on the 8th of each month.",
      C: "Run continuously every minute.",
      D: "Run only on weekends.",
    }, answer: "A" },

  { id: "S4-10", section: 4, type: "single",
    q: "Which is a key difference between an Escalation and a Workflow?",
    options: {
      A: "Escalations are time-driven (scheduled) and act on records that meet a condition; Workflows are typically state/event driven and route a record through user/system interactions.",
      B: "There is no difference.",
      C: "Workflows can only run on Sundays.",
      D: "Escalations cannot send notifications.",
    }, answer: "A" },

  { id: "S4-11", section: 4, type: "single",
    q: "When validating a workflow process, what must be done before users can use it?",
    options: {
      A: "Validate the process and then Activate (Enable) it.",
      B: "Delete it and re-create it.",
      C: "Run the Integrity Checker.",
      D: "Restart Maximo Manage.",
    }, answer: "A" },

  { id: "S4-12", section: 4, type: "single",
    q: "Which type of cron task instance is most commonly used to clean up the messages history in Manage?",
    options: { A: "MsgHistTrkCronTask", B: "LDAPSYNC", C: "ESCALATION", D: "JMSQSEQCONSUMER" }, answer: "A" },

  { id: "S4-13", section: 4, type: "single",
    q: "Where can a Communication Template be tied to a workflow node?",
    options: {
      A: "The Properties of the Task / Notification on the workflow node — Notifications tab",
      B: "Domains application",
      C: "Database Configuration",
      D: "Cron Task Setup",
    }, answer: "A" },

  { id: "S4-14", section: 4, type: "single",
    q: "Which workflow node ends a path in the workflow without setting a status?",
    options: { A: "Stop", B: "Wait", C: "Task", D: "Subprocess" }, answer: "A" },

  { id: "S4-15", section: 4, type: "single",
    q: "What is the role of a Subprocess node?",
    options: {
      A: "It calls another workflow process so the parent waits for the subprocess to complete.",
      B: "It deletes the workflow record.",
      C: "It only sends emails.",
      D: "It restarts the database.",
    }, answer: "A" },

  { id: "S4-16", section: 4, type: "single",
    q: "When configuring an Escalation, what is the role of the 'Condition' (SQL where clause)?",
    options: {
      A: "It restricts which records the escalation will act on at run time.",
      B: "It defines password complexity.",
      C: "It defines the BIRT layout.",
      D: "It controls workflow routing only.",
    }, answer: "A" },

  { id: "S4-17", section: 4, type: "single",
    q: "What happens to a Workflow process when it is set to inactive but has active assignments?",
    options: {
      A: "Existing assignments continue, but no new instances will be created for the process.",
      B: "All records are deleted.",
      C: "It restarts immediately.",
      D: "All users are logged out.",
    }, answer: "A" },

  { id: "S4-18", section: 4, type: "single",
    q: "Which application would you use to enable the Workflow toolbar buttons (Route Workflow / Stop Workflow) on a specific application?",
    options: { A: "Workflow Designer — associating the workflow process with the application; toolbar action set on the process",
               B: "Domains", C: "Cron Task Setup", D: "Database Configuration" }, answer: "A" },

  { id: "S4-19", section: 4, type: "single",
    q: "Which automation script launch point is used to run logic when an Action is invoked?",
    options: { A: "Action Launch Point", B: "Object Launch Point", C: "Attribute Launch Point", D: "Web Service Launch Point" }, answer: "A" },

  { id: "S4-20", section: 4, type: "single",
    q: "Inspection Forms can be associated with which of the following objects to be launched on its records?",
    options: {
      A: "Work Orders, Assets, Locations and similar maintenance objects (configured via Manage Inspection Forms)",
      B: "Only Communication Templates",
      C: "Only Cron Tasks",
      D: "Only Domains",
    }, answer: "A" },

  // ============================================================
  // SECTION 5 — Maximo Manage Configuration
  // ============================================================
  { id: "S5-01", section: 5, type: "single",
    q: "How many base currencies can an Organization be associated with?",
    options: { A: "One", B: "Two", C: "None", D: "One per Site" }, answer: "B" },

  { id: "S5-02", section: 5, type: "single",
    q: "Which statement is true regarding Organizations?",
    options: {
      A: "A time zone can be associated with each Organization.",
      B: "A clearing account must be defined before an Organization can be saved.",
      C: "Contiguous Asset Downtime cycles can be enabled at the Organization level.",
      D: "A PM Work Order Generation option can be associated with each Organization.",
    }, answer: "A" },

  { id: "S5-03", section: 5, type: "single",
    q: "Which Chart of Accounts action must be selected to decrease the length of a component in the GL account?",
    options: {
      A: "Resource Codes",
      B: "GL Component Maintenance",
      C: "Add/Modify Account Structure",
      D: "Organization Default Accounts",
    }, answer: "C" },

  { id: "S5-04", section: 5, type: "single",
    q: "Which statement about Start Center configurations is valid?",
    options: {
      A: "Start Center templates updates are pushed automatically.",
      B: "Start Center templates are refreshed periodically.",
      C: "Only administrators can modify Start Center Templates.",
      D: "Every user can be assigned to more than one Start Center.",
    }, answer: "D" },

  { id: "S5-05", section: 5, type: "single",
    q: "An administrator has been asked to add a new KPI that monitors the number of PM Work Orders completed on a weekly basis over time for a particular department. Within the KPI Manager, which calculation type should be used?",
    options: { A: "Trend", B: "Decimal", C: "Integer", D: "Percentage" }, answer: "B" },

  { id: "S5-06", section: 5, type: "single",
    q: "What is the highest level in the data hierarchy in Maximo Manage?",
    options: { A: "Site", B: "Organization", C: "Set", D: "System (Item Set / Company Set is enterprise-wide)" }, answer: "D" },

  { id: "S5-07", section: 5, type: "single",
    q: "Item Sets and Company Sets are shared at which level?",
    options: { A: "Site only", B: "Organization (assigned to one or more Organizations at the System / Sets level)",
               C: "User only", D: "Workflow only" }, answer: "B" },

  { id: "S5-08", section: 5, type: "single",
    q: "Which application allows you to define calendars and shifts to be used by labor and crews?",
    options: { A: "Calendars (Application)", B: "Domains", C: "Workflow Designer", D: "Cron Task Setup" }, answer: "A" },

  { id: "S5-09", section: 5, type: "single",
    q: "What is the purpose of the Application Designer?",
    options: {
      A: "It is used to modify the layout (XML presentation) of Maximo applications — adding fields, tabs, sections, etc.",
      B: "It is used to write SQL queries.",
      C: "It rebuilds database indexes.",
      D: "It is only used for BIRT reports.",
    }, answer: "A" },

  { id: "S5-10", section: 5, type: "single",
    q: "How is a conditional UI property (e.g., make a field read-only or required only when a condition is met) configured?",
    options: {
      A: "Define a Condition (Conditional Expression Manager), apply it to a security group via Conditional UI in Application Designer Control Properties.",
      B: "By writing JavaScript on the user's browser.",
      C: "By editing maximo.properties.",
      D: "It is not supported.",
    }, answer: "A" },

  { id: "S5-11", section: 5, type: "single",
    q: "Which feature locks a record so only one user can edit it at a time, requiring an explicit save or cancel?",
    options: {
      A: "Edit Mode",
      B: "Workflow Synchronization",
      C: "Audit Mode",
      D: "Sandbox Mode",
    }, answer: "A" },

  { id: "S5-12", section: 5, type: "multi",
    q: "Which two are valid Automation Script launch points?",
    options: {
      A: "Object",
      B: "Attribute",
      C: "Workflow Designer Launch Point",
      D: "Communication Template Launch Point",
      E: "Cron Pod Launch Point",
    }, answer: ["A", "B"] },

  { id: "S5-13", section: 5, type: "single",
    q: "Where are Conditional Expressions defined so they can be reused across security groups, applications, etc.?",
    options: {
      A: "Conditional Expression Manager",
      B: "Workflow Designer",
      C: "Application Designer XML only",
      D: "Domains",
    }, answer: "A" },

  { id: "S5-14", section: 5, type: "single",
    q: "Which statement best describes a Maximo Manage Site?",
    options: {
      A: "A Site is a unit within an Organization where work is performed; data such as work orders are typically site-level.",
      B: "A Site is the same as the System.",
      C: "A Site can have multiple base currencies.",
      D: "A Site can span multiple Organizations.",
    }, answer: "A" },

  { id: "S5-15", section: 5, type: "single",
    q: "How can a KPI be added to a user's Start Center?",
    options: {
      A: "Via the KPI List portlet on the Start Center, configured in the Start Center template.",
      B: "Only by editing the database directly.",
      C: "Only via the Domains application.",
      D: "Start Centers cannot show KPIs.",
    }, answer: "A" },

  { id: "S5-16", section: 5, type: "single",
    q: "Which statement is true about an Asset cost rollup?",
    options: {
      A: "It rolls up costs from child assets to a parent asset to give an aggregated view of total cost of ownership.",
      B: "It rebuilds the database indexes.",
      C: "It deletes old work orders.",
      D: "It is configured in Workflow Designer.",
    }, answer: "A" },

  { id: "S5-17", section: 5, type: "single",
    q: "Which application is used to set up Organization-level options such as Work Order Options, Inventory Options, and PM Options?",
    options: { A: "Organizations", B: "Sites", C: "Sets", D: "Domains" }, answer: "A" },

  { id: "S5-18", section: 5, type: "single",
    q: "How are KPIs scheduled to refresh their values?",
    options: { A: "KPICRONTASK in Cron Task Setup", B: "Domains", C: "Workflow Designer", D: "Database Configuration" },
    answer: "A" },

  { id: "S5-19", section: 5, type: "single",
    q: "Which describes Edit Mode at the workspace level in MAS?",
    options: {
      A: "It is a configurable mode where administrators can make UI / config changes which only become visible to other users when published, preventing partial changes.",
      B: "It is a debug log mode.",
      C: "It only applies to BIRT reports.",
      D: "It deletes all sessions.",
    }, answer: "A" },

  { id: "S5-20", section: 5, type: "single",
    q: "Which feature is used to enable a different default Start Center per security group?",
    options: {
      A: "Start Center Templates assigned to security groups; users get the merged Start Center from their groups.",
      B: "Domains",
      C: "Cron Task Setup",
      D: "Database Configuration",
    }, answer: "A" },

  { id: "S5-21", section: 5, type: "single",
    q: "Which financial entity must be set up before a transaction in Manage can be posted to a GL account?",
    options: {
      A: "Currency, Chart of Accounts and active GL Components / Account combinations",
      B: "Workflow Designer process only",
      C: "Domains only",
      D: "Cron Task Setup only",
    }, answer: "A" },

  { id: "S5-22", section: 5, type: "single",
    q: "What is the difference between a Calendar and a Shift?",
    options: {
      A: "A Calendar defines working/non-working days for a period; a Shift defines working hours within a day, applied on top of calendars.",
      B: "There is no difference.",
      C: "Shifts can only have one day.",
      D: "Calendars are only used for KPIs.",
    }, answer: "A" },

  { id: "S5-23", section: 5, type: "single",
    q: "Where is an automation script enabled or disabled?",
    options: {
      A: "Automation Scripts application — Active flag on the script",
      B: "Database Configuration",
      C: "Workflow Designer",
      D: "Domains",
    }, answer: "A" },

  { id: "S5-24", section: 5, type: "single",
    q: "Which is true about an automation script's logging?",
    options: {
      A: "Each script has a logger named after itself; logging level is set on the script and on the autoscript logger in the Logging application.",
      B: "Scripts cannot log.",
      C: "Scripts only log to the database.",
      D: "Scripts log automatically at DEBUG with no configuration.",
    }, answer: "A" },

  { id: "S5-25", section: 5, type: "single",
    q: "Which application is used to add a new tab or section to an existing application's UI?",
    options: { A: "Application Designer", B: "Database Configuration", C: "Workflow Designer", D: "Domains" },
    answer: "A" },

  { id: "S5-26", section: 5, type: "single",
    q: "Which is true about a KPI in KPI Manager?",
    options: {
      A: "A KPI executes a SQL select that returns a value (or values) and uses target/caution/alert thresholds to indicate status.",
      B: "It can only run as Java code.",
      C: "It only generates BIRT reports.",
      D: "It does not support thresholds.",
    }, answer: "A" },

  { id: "S5-27", section: 5, type: "single",
    q: "What kind of language can be used to write Automation Scripts in Manage?",
    options: { A: "Python (Jython) or JavaScript (Nashorn/GraalJS)", B: "Only COBOL", C: "Only Visual Basic", D: "Only PL/SQL" },
    answer: "A" },

  { id: "S5-28", section: 5, type: "single",
    q: "Which is the typical correct ordering when configuring the financial structure?",
    options: {
      A: "Currency Codes → Chart of Accounts (GL components) → Organization (with base currency & clearing account)",
      B: "Workflow Designer → Domains → Cron Task Setup",
      C: "Application Designer → Domains → Currency Codes",
      D: "Cron Task Setup → Communication Templates → Currency Codes",
    }, answer: "A" },

  // ============================================================
  // SECTION 6 — Troubleshooting
  // ============================================================
  { id: "S6-01", section: 6, type: "single",
    q: "Which appender writes to the application server SystemOut.log file?",
    options: { A: "Rolling", B: "Console", C: "Daily Rolling", D: "Monthly Rolling" }, answer: "B" },

  { id: "S6-02", section: 6, type: "multi",
    q: "Logging level for an Automation Script must be set in which two places?",
    options: {
      A: "on the Console appender in Logging application",
      B: "on the autoscript logger in Logging application",
      C: "on the Logging in Automation Scripts application",
      D: "on the Console appender in Automation Scripts application",
      E: "on the automation script in Automation Scripts application",
    }, answer: ["B", "E"] },

  { id: "S6-03", section: 6, type: "single",
    q: "How does Maximo Manage determine when a record has been updated by another user (optimistic locking)?",
    options: {
      A: "Looks for new entry in audit table.",
      B: "Compares the rowstamp attribute on the existing record.",
      C: "Compares the changeby attribute on the existing record.",
      D: "Compares the changedate attribute on the existing record.",
    }, answer: "B" },

  { id: "S6-04", section: 6, type: "single",
    q: "What is meant by the error: 'Object WORKORDER : Site=BEDFORD Work Order=3667 cannot be saved with the data that was provided.'?",
    options: {
      A: "Record violates a unique index.",
      B: "Required attributes have not been set.",
      C: "The user does not have access to that site.",
      D: "A data restriction would prevent the user from saving the record.",
    }, answer: "D" },

  { id: "S6-05", section: 6, type: "single",
    q: "In Maximo Manage, which option may be used to execute Integrity Checker?",
    options: {
      A: "Access the Maximo Admin POD to execute Integrity Checker on the server.",
      B: "Access the Administration application to activate the Integrity Checker Action.",
      C: "Access the Database Configuration application to activate the Integrity Checker Action.",
      D: "Access the WebSphere Application Server console to execute Integrity Checker.",
    }, answer: "A" },

  { id: "S6-06", section: 6, type: "single",
    q: "What is one way to determine if the Maximo Performance Monitor is running?",
    options: {
      A: "run the Maximo Activity Dashboard BIRT report",
      B: "the Maximo Management Interface Perfmon Running flag",
      C: "the value on the webclient.performancestatistics System Property",
      D: "a yellow Performance Monitor mode message in the Start Center",
    }, answer: "B" },

  { id: "S6-07", section: 6, type: "single",
    q: "Which logger should be enabled at DEBUG to investigate why a SQL statement is slow?",
    options: { A: "log4j.logger.maximo.sql", B: "log4j.logger.maximo.audit", C: "log4j.logger.maximo.report.birt", D: "log4j.logger.maximo.crontask" }, answer: "A" },

  { id: "S6-08", section: 6, type: "single",
    q: "In which Manage application are loggers and appenders managed at runtime?",
    options: { A: "Logging", B: "Application Designer", C: "Database Configuration", D: "Domains" }, answer: "A" },

  { id: "S6-09", section: 6, type: "single",
    q: "Which appender writes log output to a daily rotated file on disk?",
    options: { A: "Daily Rolling", B: "Console", C: "JDBC", D: "SMTP" }, answer: "A" },

  { id: "S6-10", section: 6, type: "single",
    q: "What does the Integrity Checker primarily verify?",
    options: {
      A: "Consistency between the Maximo metadata (MAXOBJECT, MAXATTRIBUTE) and the actual database structure.",
      B: "User passwords.",
      C: "Network throughput.",
      D: "The license file.",
    }, answer: "A" },

  { id: "S6-11", section: 6, type: "single",
    q: "If users get 'unique constraint violated' errors when saving, the most likely root cause is:",
    options: {
      A: "An attempt to insert a duplicate key for an attribute backed by a unique index.",
      B: "Their browser is too old.",
      C: "The mxe.email.from property is wrong.",
      D: "A workflow is incorrectly inactive.",
    }, answer: "A" },

  { id: "S6-12", section: 6, type: "single",
    q: "Which property controls whether the Performance Monitor (perfmon) is enabled in Manage?",
    options: { A: "mxe.perfmon.* properties (e.g., mxe.perfmon.enable / Perfmon Running flag)", B: "mxe.email.from", C: "mxe.report.birt.viewerurl", D: "mxe.usermonitor.frequency" }, answer: "A" },

  { id: "S6-13", section: 6, type: "single",
    q: "When a user complains about a slow application, which logger is typically very useful first?",
    options: {
      A: "the SQL logger (maximo.sql) at DEBUG to capture the SQL Manage is sending to the DB",
      B: "the audit logger only",
      C: "the BIRT logger only",
      D: "the LDAP logger",
    }, answer: "A" },

  { id: "S6-14", section: 6, type: "single",
    q: "What is the typical first step when investigating a recurring Cron Task failure?",
    options: {
      A: "Set the cron task logger (e.g., crontask) to DEBUG and re-run, then inspect the SystemOut.log.",
      B: "Drop the database.",
      C: "Restart the user's browser.",
      D: "Re-install Manage.",
    }, answer: "A" },

  { id: "S6-15", section: 6, type: "single",
    q: "Which is the correct way to safely clear an Edit Mode record lock that is no longer needed?",
    options: {
      A: "Use the Edit Mode admin to release the lock for that record.",
      B: "Delete the record.",
      C: "Restart the database.",
      D: "Reset all user passwords.",
    }, answer: "A" },

  { id: "S6-16", section: 6, type: "single",
    q: "When Manage logs show 'BMXAA****E' style codes, what should an administrator do?",
    options: {
      A: "Look up the BMXAA error code in the IBM documentation / knowledge base for resolution steps.",
      B: "Ignore them — they are warnings.",
      C: "Reboot the database server.",
      D: "Clear the browser cache.",
    }, answer: "A" },

  { id: "S6-17", section: 6, type: "single",
    q: "If a BIRT report is failing with a memory error, which area should an administrator review?",
    options: {
      A: "The report bundle / BIRT JVM heap settings, plus the report query (limit rows / parameters).",
      B: "Domains application.",
      C: "Workflow Designer.",
      D: "Cron Task Setup only.",
    }, answer: "A" },

  { id: "S6-18", section: 6, type: "single",
    q: "Which logger should be enabled to troubleshoot the LDAPSYNC cron task?",
    options: {
      A: "log4j.logger.maximo.crontask.LDAPSYNC (and 'security' / 'login' related loggers)",
      B: "log4j.logger.maximo.report.birt only",
      C: "log4j.logger.maximo.audit only",
      D: "log4j.logger.maximo.sqltrace only",
    }, answer: "A" },

  { id: "S6-19", section: 6, type: "single",
    q: "Which is true about the Maximo logger hierarchy?",
    options: {
      A: "Loggers inherit their level from parent loggers unless explicitly set.",
      B: "Loggers cannot be changed at runtime.",
      C: "Each logger maintains a separate database connection.",
      D: "Log4j is not used.",
    }, answer: "A" },

  { id: "S6-20", section: 6, type: "single",
    q: "Which is the recommended way to safely investigate a stuck workflow assignment?",
    options: {
      A: "Use the Workflow Administration to view active assignments and reassign or stop the process.",
      B: "Delete the user.",
      C: "Drop and re-create the workflow table.",
      D: "Reboot the database.",
    }, answer: "A" },

  { id: "S6-21", section: 6, type: "single",
    q: "Which file is the primary destination for Manage runtime logs in OpenShift?",
    options: {
      A: "Pod stdout (visible via oc logs / OpenShift logs UI), surfaced as SystemOut.log equivalent",
      B: "/etc/passwd",
      C: "/tmp only",
      D: "the database error log",
    }, answer: "A" },

  { id: "S6-22", section: 6, type: "single",
    q: "An administrator gets the message 'Record has been updated by another user'. What is the cause?",
    options: {
      A: "Optimistic locking — another session saved the record after this user fetched it; the rowstamp comparison failed.",
      B: "The database is corrupted.",
      C: "Their license expired.",
      D: "The cron task is disabled.",
    }, answer: "A" },

  { id: "S6-23", section: 6, type: "single",
    q: "If the Performance Monitor is enabled, where can an administrator review the captured statistics?",
    options: {
      A: "The Maximo Management Interface (and BIRT performance reports) — performance data is captured in MAXIMO performance tables.",
      B: "Only in the OS event log.",
      C: "Only in maximo.properties.",
      D: "Only in the user's browser cache.",
    }, answer: "A" },

  { id: "S6-24", section: 6, type: "single",
    q: "Which is a recommended best practice when raising log levels on a production system?",
    options: {
      A: "Raise the level temporarily for the specific logger needed, capture the issue, and reset to the original level.",
      B: "Always set every logger to DEBUG permanently.",
      C: "Disable all logging.",
      D: "Only enable TRACE logging on Sundays.",
    }, answer: "A" },

  // ============================================================
  // SECTION 7 — Integration
  // ============================================================
  { id: "S7-01", section: 7, type: "single",
    q: "The content of XML or JSON messages is defined in which Maximo Manage application?",
    options: { A: "Interactions", B: "Object Structures", C: "Integration Modules", D: "Web Services Library" }, answer: "B" },

  { id: "S7-02", section: 7, type: "single",
    q: "What is the Message Tracking action in the publish channel used for?",
    options: {
      A: "to view the messages",
      B: "to delete the messages",
      C: "to process the messages",
      D: "to enable storing messages",
    }, answer: "D" },

  { id: "S7-03", section: 7, type: "single",
    q: "What is used to prevent duplicate processing of Kafka messages?",
    options: { A: "Offset value", B: "Sequential queues", C: "Deleting messages", D: "Retention periods" }, answer: "A" },

  { id: "S7-04", section: 7, type: "single",
    q: "Which Maximo application is used to define the destination configuration (URL, credentials) for sending data to an external system?",
    options: { A: "End Points", B: "Domains", C: "Application Designer", D: "Database Configuration" }, answer: "A" },

  { id: "S7-05", section: 7, type: "single",
    q: "Which application is used to define an external system, and to associate publish channels and enterprise services with it?",
    options: { A: "External Systems", B: "Application Designer", C: "Domains", D: "Database Configuration" }, answer: "A" },

  { id: "S7-06", section: 7, type: "single",
    q: "Which integration component is used to send Maximo data outbound to an external system?",
    options: { A: "Publish Channel", B: "Enterprise Service", C: "Communication Template", D: "Cron Task" }, answer: "A" },

  { id: "S7-07", section: 7, type: "single",
    q: "Which integration component is used to receive inbound data into Maximo?",
    options: { A: "Enterprise Service", B: "Publish Channel", C: "Communication Template", D: "Domain" }, answer: "A" },

  { id: "S7-08", section: 7, type: "single",
    q: "Which feature allows reprocessing of failed or queued integration messages?",
    options: {
      A: "Message Reprocessing application",
      B: "Domains",
      C: "Application Designer",
      D: "Cron Task Setup",
    }, answer: "A" },

  { id: "S7-09", section: 7, type: "single",
    q: "What is an Object Structure in Maximo's integration framework?",
    options: {
      A: "A hierarchical definition of one or more business objects (parent + child) used as the payload for integration and reporting.",
      B: "A network firewall rule.",
      C: "A user role.",
      D: "A BIRT layout file.",
    }, answer: "A" },

  { id: "S7-10", section: 7, type: "single",
    q: "Which application is used to import or export Application configuration (like menus and presentations)?",
    options: {
      A: "Application Designer (Import/Export Application Definition) and Migration Manager",
      B: "Domains",
      C: "Cron Task Setup",
      D: "Database Configuration",
    }, answer: "A" },

  { id: "S7-11", section: 7, type: "single",
    q: "What is a Kafka topic, in the context of Maximo Manage messaging?",
    options: {
      A: "A named queue/stream where producers publish messages and consumers subscribe to read them.",
      B: "A type of BIRT report.",
      C: "A new domain type.",
      D: "A field on an Object Structure.",
    }, answer: "A" },

  { id: "S7-12", section: 7, type: "single",
    q: "Which is true about JMS / Kafka messaging in Manage?",
    options: {
      A: "Manage supports asynchronous messaging through queues; integration messages can be queued sequentially or continuously based on configuration.",
      B: "Manage only supports synchronous HTTP integrations.",
      C: "Messaging is not supported at all.",
      D: "Messaging requires the BIRT engine.",
    }, answer: "A" },

  { id: "S7-13", section: 7, type: "single",
    q: "What is the role of an Integration Module / Logical Management Operation (LMO) in Maximo?",
    options: {
      A: "It defines a re-usable invocation contract with an external system used by integrations and the LMO framework.",
      B: "It is a security group.",
      C: "It only sends emails.",
      D: "It is the same as a Communication Template.",
    }, answer: "A" },

  { id: "S7-14", section: 7, type: "single",
    q: "An administrator wants to monitor outbound messages and re-send any that failed. Which two applications are most directly used?",
    options: {
      A: "Message Tracking (to view) and Message Reprocessing (to fix and resend)",
      B: "Domains and Communication Templates",
      C: "Cron Task Setup and Workflow Designer",
      D: "Database Configuration and Application Designer",
    }, answer: "A" },

  { id: "S7-15", section: 7, type: "single",
    q: "Which application allows an administrator to import an Application configuration XML file and replace the existing application?",
    options: { A: "Application Designer — Import Application Definition", B: "Domains", C: "Cron Task Setup", D: "Workflow Designer" },
    answer: "A" },

  { id: "S7-16", section: 7, type: "single",
    q: "Which protocol is most commonly used by Manage REST/JSON integrations?",
    options: { A: "HTTP/HTTPS", B: "FTP only", C: "SMB only", D: "Plain TCP socket" }, answer: "A" },

  { id: "S7-17", section: 7, type: "single",
    q: "What is the role of a Publish Channel's processing class / automation script?",
    options: {
      A: "It transforms or filters the outbound message before it is sent to the endpoint.",
      B: "It changes user passwords.",
      C: "It deletes the database.",
      D: "It is only for inbound channels.",
    }, answer: "A" },

  { id: "S7-18", section: 7, type: "single",
    q: "Which is true about Object Structure security?",
    options: {
      A: "Object Structures can be authorized to security groups so that only authorized integrations or reports can use them.",
      B: "All Object Structures are public.",
      C: "Object Structures cannot be secured.",
      D: "Object Structure security is only used for KPIs.",
    }, answer: "A" },

  { id: "S7-19", section: 7, type: "single",
    q: "What does a Kafka 'consumer offset' represent?",
    options: {
      A: "The position in the topic up to which a consumer has read messages — used to resume and to avoid duplicates.",
      B: "The latency in milliseconds.",
      C: "The number of replicas.",
      D: "The disk encryption key.",
    }, answer: "A" },

  { id: "S7-20", section: 7, type: "single",
    q: "Which technique is most appropriate when integrating Manage with a system that requires near real-time inbound data?",
    options: {
      A: "Use an Enterprise Service over an HTTP/Kafka endpoint with appropriate authentication.",
      B: "Use BIRT reports.",
      C: "Use Communication Templates.",
      D: "Use the Domains application.",
    }, answer: "A" },
];

// Section colors for UI accents
const SECTION_COLORS = {
  1: { bg: "bg-blue-50",     border: "border-blue-300",    text: "text-blue-900",    chip: "bg-blue-100 text-blue-900" },
  2: { bg: "bg-rose-50",     border: "border-rose-300",    text: "text-rose-900",    chip: "bg-rose-100 text-rose-900" },
  3: { bg: "bg-amber-50",    border: "border-amber-300",   text: "text-amber-900",   chip: "bg-amber-100 text-amber-900" },
  4: { bg: "bg-emerald-50",  border: "border-emerald-300", text: "text-emerald-900", chip: "bg-emerald-100 text-emerald-900" },
  5: { bg: "bg-violet-50",   border: "border-violet-300",  text: "text-violet-900",  chip: "bg-violet-100 text-violet-900" },
  6: { bg: "bg-orange-50",   border: "border-orange-300",  text: "text-orange-900",  chip: "bg-orange-100 text-orange-900" },
  7: { bg: "bg-teal-50",     border: "border-teal-300",    text: "text-teal-900",    chip: "bg-teal-100 text-teal-900" },
};

// Utility: Fisher-Yates shuffle
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Pick N random questions from a section, shuffling option order too
function buildExam() {
  const exam = [];
  for (const sec of [1, 2, 3, 4, 5, 6, 7]) {
    const pool = QUESTIONS.filter(q => q.section === sec);
    const need = SECTION_META[sec].count;
    const picked = shuffle(pool).slice(0, need);
    exam.push(...picked);
  }
  return exam;
}

// Compare answer
function isCorrect(q, userAnswer) {
  if (userAnswer == null) return false;
  if (q.type === "single") return userAnswer === q.answer;
  // multi
  if (!Array.isArray(userAnswer)) return false;
  const a = [...userAnswer].sort().join(",");
  const b = [...q.answer].sort().join(",");
  return a === b;
}

// =====================================================================
// Main App Component
// =====================================================================
export default function App() {
  const [screen, setScreen] = useState("home"); // home | exam | results | review
  const [exam, setExam] = useState([]);
  const [answers, setAnswers] = useState({});
  const [marked, setMarked] = useState({}); // qId -> bool
  const [currentIdx, setCurrentIdx] = useState(0);
  const [startedAt, setStartedAt] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [submittedAt, setSubmittedAt] = useState(null);
  const [history, setHistory] = useState([]); // past attempts {date, score, total, sections}
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const tickRef = useRef(null);

  // Load past attempts from persistent storage
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("history");
        if (r && r.value) setHistory(JSON.parse(r.value));
      } catch (e) { /* no history yet */ }
    })();
  }, []);

  // Timer (90 minutes typical for IBM exam)
  const EXAM_DURATION_MS = 90 * 60 * 1000;
  useEffect(() => {
    if (screen === "exam" && startedAt) {
      tickRef.current = setInterval(() => setNow(Date.now()), 1000);
      return () => clearInterval(tickRef.current);
    }
  }, [screen, startedAt]);

  const elapsed = startedAt ? now - startedAt : 0;
  const remaining = Math.max(0, EXAM_DURATION_MS - elapsed);

  // Auto-submit when time runs out
  useEffect(() => {
    if (screen === "exam" && startedAt && remaining === 0 && !submittedAt) {
      handleSubmit();
    }
    // eslint-disable-next-line
  }, [remaining]);

  function startExam() {
    const e = buildExam();
    setExam(e);
    setAnswers({});
    setMarked({});
    setCurrentIdx(0);
    setStartedAt(Date.now());
    setNow(Date.now());
    setSubmittedAt(null);
    setScreen("exam");
  }

  function handleAnswer(qId, opt, type) {
    setAnswers(prev => {
      if (type === "single") return { ...prev, [qId]: opt };
      const cur = Array.isArray(prev[qId]) ? prev[qId] : [];
      if (cur.includes(opt)) {
        return { ...prev, [qId]: cur.filter(x => x !== opt) };
      }
      return { ...prev, [qId]: [...cur, opt] };
    });
  }

  function toggleMarked(qId) {
    setMarked(prev => ({ ...prev, [qId]: !prev[qId] }));
  }

  function handleSubmit() {
    setSubmittedAt(Date.now());
    setShowSubmitConfirm(false);

    // Compute and persist
    let correct = 0;
    const sectionScores = {};
    for (const q of exam) {
      const ok = isCorrect(q, answers[q.id]);
      if (ok) correct += 1;
      sectionScores[q.section] = sectionScores[q.section] || { correct: 0, total: 0 };
      sectionScores[q.section].total += 1;
      if (ok) sectionScores[q.section].correct += 1;
    }
    const attempt = {
      date: new Date().toISOString(),
      correct,
      total: exam.length,
      pct: Math.round((correct / exam.length) * 100),
      sections: sectionScores,
    };
    const newHistory = [attempt, ...history].slice(0, 25);
    setHistory(newHistory);
    (async () => {
      try { await window.storage.set("history", JSON.stringify(newHistory)); } catch {}
    })();

    setScreen("results");
  }

  function clearHistory() {
    setHistory([]);
    (async () => { try { await window.storage.delete("history"); } catch {} })();
  }

  // ----- Render screens -----
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900" style={{ fontFamily: '"Inter", "Helvetica Neue", system-ui, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@500;700;900&family=Inter:wght@400;500;600;700&display=swap');
        .display-font { font-family: 'Fraunces', 'Times New Roman', serif; font-feature-settings: 'ss01' 1; }
        .mono { font-family: ui-monospace, "SF Mono", Menlo, monospace; }
        .pulse-ring { box-shadow: 0 0 0 0 rgba(15, 76, 129, 0.5); animation: pulse 2.2s cubic-bezier(0.4,0,0.6,1) infinite; }
        @keyframes pulse { 70% { box-shadow: 0 0 0 14px rgba(15, 76, 129, 0); } 100% { box-shadow: 0 0 0 0 rgba(15, 76, 129, 0); } }
      `}</style>

      <header className="border-b border-slate-200 bg-white/70 backdrop-blur sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center text-white font-bold text-sm">M</div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">IBM Certification Practice</div>
              <div className="display-font text-lg leading-tight">C1000-141 · Maximo Manage v8.x Administrator</div>
            </div>
          </div>
          {screen === "exam" && (
            <Timer remaining={remaining} />
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-8">
        {screen === "home"   && <Home onStart={startExam} history={history} clearHistory={clearHistory} />}
        {screen === "exam"   && (
          <ExamScreen
            exam={exam}
            currentIdx={currentIdx}
            setCurrentIdx={setCurrentIdx}
            answers={answers}
            handleAnswer={handleAnswer}
            marked={marked}
            toggleMarked={toggleMarked}
            onRequestSubmit={() => setShowSubmitConfirm(true)}
          />
        )}
        {screen === "results" && (
          <Results
            exam={exam}
            answers={answers}
            onReview={() => setScreen("review")}
            onRestart={() => setScreen("home")}
          />
        )}
        {screen === "review" && (
          <Review
            exam={exam}
            answers={answers}
            onBack={() => setScreen("results")}
            onHome={() => setScreen("home")}
          />
        )}
      </main>

      {showSubmitConfirm && (
        <Modal onClose={() => setShowSubmitConfirm(false)}>
          <div className="display-font text-2xl mb-2">Submit exam?</div>
          <p className="text-slate-600 mb-1">You have answered <b>{Object.keys(answers).filter(k => {
            const v = answers[k];
            return Array.isArray(v) ? v.length > 0 : v != null;
          }).length}</b> of <b>{exam.length}</b> questions.</p>
          <p className="text-slate-600 mb-5 text-sm">Once submitted, your score is recorded and you can review every answer.</p>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setShowSubmitConfirm(false)} className="px-4 py-2 rounded-md border border-slate-300 hover:bg-slate-50">Cancel</button>
            <button onClick={handleSubmit} className="px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800">Submit now</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// =====================================================================
// Sub-components
// =====================================================================
function Timer({ remaining }) {
  const m = Math.floor(remaining / 60000);
  const s = Math.floor((remaining % 60000) / 1000);
  const low = remaining < 5 * 60 * 1000;
  return (
    <div className={`mono px-3 py-1.5 rounded-md text-sm font-semibold ${low ? "bg-rose-50 text-rose-700 border border-rose-200" : "bg-slate-100 text-slate-700 border border-slate-200"}`}>
      {String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-40 px-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function Home({ onStart, history, clearHistory }) {
  const totalPool = QUESTIONS.length;
  const last = history[0];

  return (
    <div className="space-y-8">
      <section className="bg-white border border-slate-200 rounded-2xl p-8 md:p-10 shadow-sm">
        <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-3">Practice exam</div>
        <h1 className="display-font text-4xl md:text-5xl font-bold leading-tight mb-3">Pass the C1000&#8209;141.</h1>
        <p className="text-slate-600 text-lg max-w-2xl mb-6">A full-length, IBM-style mock exam &mdash; 67 questions across 7 sections, randomly drawn from a pool of <b>{totalPool}</b>. 90 minutes. Pass mark <b>71%</b>.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7">
          <Stat label="Pool size"    value={totalPool} />
          <Stat label="Per attempt"  value={67} />
          <Stat label="Pass mark"    value="71%" />
          <Stat label="Time"         value="90 min" />
        </div>

        <button onClick={onStart} className="pulse-ring inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition shadow-md">
          Start a new attempt
          <span aria-hidden>&rarr;</span>
        </button>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-3">Section blueprint</div>
          <h2 className="display-font text-2xl mb-4">7 sections, 67 questions</h2>
          <ul className="space-y-2">
            {Object.entries(SECTION_META).map(([k, v]) => {
              const c = SECTION_COLORS[k];
              const poolCount = QUESTIONS.filter(q => q.section === Number(k)).length;
              return (
                <li key={k} className="flex items-center justify-between gap-3 py-2 border-b border-slate-100 last:border-none">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`text-xs font-bold w-7 h-7 rounded-md flex items-center justify-center ${c.chip}`}>S{k}</span>
                    <span className="truncate text-slate-800">{v.name}</span>
                  </div>
                  <div className="text-sm text-slate-500 mono whitespace-nowrap">
                    <span className="text-slate-900 font-semibold">{v.count}</span>
                    <span className="opacity-60"> · pool {poolCount}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Past attempts</div>
            {history.length > 0 && (
              <button onClick={clearHistory} className="text-xs text-slate-400 hover:text-rose-600">Clear</button>
            )}
          </div>
          <h2 className="display-font text-2xl mb-4">Track your progress</h2>
          {history.length === 0 ? (
            <p className="text-slate-500 text-sm">No attempts yet. Start your first practice exam to begin tracking your score over time.</p>
          ) : (
            <div className="space-y-2">
              {history.slice(0, 8).map((h, i) => {
                const passed = h.pct >= 71;
                return (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-none">
                    <div className={`mono text-sm font-bold w-14 text-right ${passed ? "text-emerald-600" : "text-rose-600"}`}>{h.pct}%</div>
                    <div className="flex-1">
                      <div className="text-sm">{h.correct} / {h.total} correct</div>
                      <div className="text-xs text-slate-500">{new Date(h.date).toLocaleString()}</div>
                    </div>
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${passed ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                      {passed ? "Pass" : "Fail"}
                    </span>
                  </div>
                );
              })}
              {last && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-2">Most recent &mdash; section breakdown</div>
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    {Object.entries(last.sections).map(([sec, s]) => {
                      const pct = Math.round((s.correct / s.total) * 100);
                      return (
                        <div key={sec} className="flex justify-between bg-slate-50 px-2 py-1 rounded">
                          <span>S{sec}</span>
                          <span className={`mono font-semibold ${pct >= 71 ? "text-emerald-700" : "text-rose-700"}`}>{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="bg-slate-900 text-white rounded-2xl p-6 md:p-8">
        <div className="display-font text-2xl mb-2">How to use this tool effectively</div>
        <ol className="list-decimal list-inside space-y-1.5 text-slate-300 text-sm md:text-base">
          <li>Take a full timed attempt &mdash; resist the urge to peek at answers.</li>
          <li>After submitting, study the <b>section-wise score</b>. Your real exam showed weakness in Troubleshooting (10%), Process Automation (29%), and Maximo Manage Configuration (25%) &mdash; hammer those.</li>
          <li>Use <b>Review mode</b> to read every wrong answer. Don&rsquo;t just memorize &mdash; understand <i>why</i> it&rsquo;s the right one.</li>
          <li>Re-take. Each attempt pulls a fresh random mix from the question pool.</li>
        </ol>
      </section>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
      <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-1">{label}</div>
      <div className="display-font text-2xl font-bold text-slate-900">{value}</div>
    </div>
  );
}

function ExamScreen({ exam, currentIdx, setCurrentIdx, answers, handleAnswer, marked, toggleMarked, onRequestSubmit }) {
  const q = exam[currentIdx];
  const userAnswer = answers[q.id];
  const c = SECTION_COLORS[q.section];

  const answeredCount = exam.filter(qq => {
    const v = answers[qq.id];
    return Array.isArray(v) ? v.length > 0 : v != null;
  }).length;

  return (
    <div className="grid md:grid-cols-[1fr_240px] gap-6">
      {/* Question card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] uppercase tracking-[0.2em] font-bold px-2 py-1 rounded ${c.chip}`}>Section {q.section}</span>
            <span className="text-xs text-slate-500">{SECTION_META[q.section].name}</span>
          </div>
          <div className="mono text-xs text-slate-500">Q {currentIdx + 1} / {exam.length}</div>
        </div>

        <div className="display-font text-xl md:text-[22px] leading-snug font-semibold text-slate-900 mb-2">
          {q.q}
        </div>
        <div className="text-xs text-slate-500 mb-5">
          {q.type === "multi"
            ? `Select ${Array.isArray(q.answer) ? q.answer.length : "all"} that apply.`
            : "Select one answer."}
        </div>

        <div className="space-y-2.5">
          {Object.entries(q.options).map(([letter, text]) => {
            const isSelected =
              q.type === "single"
                ? userAnswer === letter
                : Array.isArray(userAnswer) && userAnswer.includes(letter);
            return (
              <button
                key={letter}
                onClick={() => handleAnswer(q.id, letter, q.type)}
                className={`w-full text-left px-4 py-3 rounded-lg border transition flex items-start gap-3 ${
                  isSelected
                    ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50"
                }`}
              >
                <span className={`mono text-xs font-bold w-6 h-6 rounded flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  isSelected ? "bg-white text-slate-900" : "bg-slate-100 text-slate-700"
                }`}>{letter}</span>
                <span className={isSelected ? "text-white" : "text-slate-800"}>{text}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between mt-7 pt-5 border-t border-slate-100">
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
              disabled={currentIdx === 0}
              className="px-4 py-2 rounded-md border border-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >&larr; Previous</button>
            <button
              onClick={() => setCurrentIdx(Math.min(exam.length - 1, currentIdx + 1))}
              disabled={currentIdx === exam.length - 1}
              className="px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >Next &rarr;</button>
          </div>
          <button
            onClick={() => toggleMarked(q.id)}
            className={`px-3 py-2 rounded-md text-sm border transition ${
              marked[q.id]
                ? "bg-amber-100 border-amber-400 text-amber-900"
                : "border-slate-300 hover:bg-slate-50"
            }`}
          >
            {marked[q.id] ? "★ Marked" : "☆ Mark for review"}
          </button>
        </div>
      </div>

      {/* Sidebar: navigator */}
      <aside className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm h-max md:sticky md:top-24">
        <div className="mb-3">
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-1">Progress</div>
          <div className="display-font text-xl font-bold">{answeredCount} / {exam.length}</div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-slate-900 transition-all" style={{ width: `${(answeredCount / exam.length) * 100}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-7 md:grid-cols-6 gap-1.5 mt-4">
          {exam.map((qq, i) => {
            const ans = answers[qq.id];
            const isAns = Array.isArray(ans) ? ans.length > 0 : ans != null;
            const isCurrent = i === currentIdx;
            const isMarked = marked[qq.id];
            return (
              <button
                key={qq.id}
                onClick={() => setCurrentIdx(i)}
                className={`mono text-[10px] h-7 rounded relative transition ${
                  isCurrent
                    ? "bg-slate-900 text-white ring-2 ring-slate-900 ring-offset-1"
                    : isAns
                    ? "bg-slate-200 text-slate-900 hover:bg-slate-300"
                    : "bg-slate-50 text-slate-400 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {i + 1}
                {isMarked && <span className="absolute -top-1 -right-1 text-amber-500 text-[10px]">★</span>}
              </button>
            );
          })}
        </div>

        <button
          onClick={onRequestSubmit}
          className="w-full mt-5 px-4 py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition shadow-sm"
        >Submit exam</button>

        <div className="mt-4 text-[11px] text-slate-500 leading-relaxed">
          <div className="flex items-center gap-1.5 mb-1"><span className="inline-block w-3 h-3 rounded bg-slate-900" />Current</div>
          <div className="flex items-center gap-1.5 mb-1"><span className="inline-block w-3 h-3 rounded bg-slate-200" />Answered</div>
          <div className="flex items-center gap-1.5 mb-1"><span className="inline-block w-3 h-3 rounded bg-slate-50 border border-slate-200" />Unanswered</div>
          <div className="flex items-center gap-1.5"><span className="text-amber-500 text-xs">★</span>Marked for review</div>
        </div>
      </aside>
    </div>
  );
}

function Results({ exam, answers, onReview, onRestart }) {
  let correct = 0;
  const sectionScores = {};
  for (const q of exam) {
    const ok = isCorrect(q, answers[q.id]);
    if (ok) correct += 1;
    sectionScores[q.section] = sectionScores[q.section] || { correct: 0, total: 0 };
    sectionScores[q.section].total += 1;
    if (ok) sectionScores[q.section].correct += 1;
  }
  const pct = Math.round((correct / exam.length) * 100);
  const passed = pct >= 71;

  return (
    <div className="space-y-6">
      <div className={`rounded-2xl p-8 md:p-10 border-2 ${passed ? "bg-emerald-50 border-emerald-300" : "bg-rose-50 border-rose-300"}`}>
        <div className="text-[11px] uppercase tracking-[0.2em] text-slate-600 mb-2">Result</div>
        <div className={`display-font text-5xl md:text-6xl font-black mb-2 ${passed ? "text-emerald-700" : "text-rose-700"}`}>
          {passed ? "Pass" : "Fail"}
        </div>
        <div className="text-2xl font-semibold text-slate-800">{correct} / {exam.length} correct &middot; {pct}%</div>
        <div className="text-slate-600 mt-1">Pass mark: 71% ({Math.ceil(exam.length * 0.71)} / {exam.length})</div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 mb-1">Section breakdown</div>
        <h2 className="display-font text-2xl mb-5">Where you stand</h2>
        <div className="space-y-3">
          {Object.entries(SECTION_META).map(([sec, meta]) => {
            const s = sectionScores[sec] || { correct: 0, total: 0 };
            const p = s.total ? Math.round((s.correct / s.total) * 100) : 0;
            const c = SECTION_COLORS[sec];
            const ok = p >= 71;
            return (
              <div key={sec}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`text-[10px] font-bold w-7 h-6 rounded flex items-center justify-center ${c.chip}`}>S{sec}</span>
                    <span className="text-sm text-slate-800 truncate">{meta.name}</span>
                  </div>
                  <div className="mono text-sm">
                    <span className="text-slate-500">{s.correct}/{s.total}</span>
                    <span className={`ml-2 font-bold ${ok ? "text-emerald-700" : "text-rose-700"}`}>{p}%</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full transition-all ${ok ? "bg-emerald-500" : "bg-rose-500"}`} style={{ width: `${p}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button onClick={onReview} className="px-5 py-3 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800">
          Review answers &rarr;
        </button>
        <button onClick={onRestart} className="px-5 py-3 rounded-lg border border-slate-300 hover:bg-slate-50 font-semibold">
          Back to home
        </button>
      </div>
    </div>
  );
}

function Review({ exam, answers, onBack, onHome }) {
  const [filter, setFilter] = useState("all"); // all | wrong | correct | unanswered
  const filtered = exam.filter(q => {
    const v = answers[q.id];
    const noAns = Array.isArray(v) ? v.length === 0 : v == null;
    const ok = isCorrect(q, v);
    if (filter === "all") return true;
    if (filter === "wrong") return !ok && !noAns;
    if (filter === "correct") return ok;
    if (filter === "unanswered") return noAns;
    return true;
  });

  const counts = useMemo(() => {
    let ok = 0, wr = 0, un = 0;
    for (const q of exam) {
      const v = answers[q.id];
      const noAns = Array.isArray(v) ? v.length === 0 : v == null;
      if (noAns) un++;
      else if (isCorrect(q, v)) ok++;
      else wr++;
    }
    return { ok, wr, un };
  }, [exam, answers]);

  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-wrap items-center gap-2 justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <FilterChip active={filter === "all"}        onClick={() => setFilter("all")}        label={`All (${exam.length})`}             />
          <FilterChip active={filter === "wrong"}      onClick={() => setFilter("wrong")}      label={`Wrong (${counts.wr})`}      tone="rose"     />
          <FilterChip active={filter === "correct"}    onClick={() => setFilter("correct")}    label={`Correct (${counts.ok})`}    tone="emerald"  />
          <FilterChip active={filter === "unanswered"} onClick={() => setFilter("unanswered")} label={`Unanswered (${counts.un})`} tone="amber"    />
        </div>
        <div className="flex gap-2">
          <button onClick={onBack} className="px-4 py-2 rounded-md border border-slate-300 hover:bg-slate-50">&larr; Back to result</button>
          <button onClick={onHome} className="px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800">Home</button>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((q, idx) => {
          const v = answers[q.id];
          const noAns = Array.isArray(v) ? v.length === 0 : v == null;
          const ok = isCorrect(q, v);
          const c = SECTION_COLORS[q.section];
          const correctSet = new Set(Array.isArray(q.answer) ? q.answer : [q.answer]);
          const userSet = new Set(Array.isArray(v) ? v : v ? [v] : []);
          return (
            <div key={q.id} className={`bg-white border rounded-xl p-5 shadow-sm ${ok ? "border-emerald-200" : noAns ? "border-amber-200" : "border-rose-200"}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] uppercase tracking-[0.2em] font-bold px-2 py-1 rounded ${c.chip}`}>S{q.section}</span>
                  <span className="text-xs text-slate-500 mono">{q.id}</span>
                  <span className="text-xs text-slate-500">·</span>
                  <span className="text-xs text-slate-500">{q.type === "multi" ? "multi-select" : "single-select"}</span>
                </div>
                <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                  ok ? "bg-emerald-100 text-emerald-700"
                     : noAns ? "bg-amber-100 text-amber-700"
                             : "bg-rose-100 text-rose-700"
                }`}>{ok ? "Correct" : noAns ? "Skipped" : "Wrong"}</span>
              </div>
              <div className="display-font text-base font-semibold text-slate-900 mb-3">{q.q}</div>
              <div className="space-y-1.5">
                {Object.entries(q.options).map(([letter, text]) => {
                  const isCorrectOpt = correctSet.has(letter);
                  const isUserOpt = userSet.has(letter);
                  let cls = "border-slate-200 bg-white";
                  let icon = "";
                  if (isCorrectOpt) {
                    cls = "border-emerald-300 bg-emerald-50";
                    icon = "✓";
                  }
                  if (isUserOpt && !isCorrectOpt) {
                    cls = "border-rose-300 bg-rose-50";
                    icon = "✗";
                  }
                  if (isUserOpt && isCorrectOpt) icon = "✓";
                  return (
                    <div key={letter} className={`px-3 py-2 rounded border flex items-start gap-2 text-sm ${cls}`}>
                      <span className={`mono font-bold w-5 ${isCorrectOpt ? "text-emerald-700" : isUserOpt ? "text-rose-700" : "text-slate-500"}`}>{letter}.</span>
                      <span className="flex-1 text-slate-800">{text}</span>
                      {icon && <span className={`mono font-bold ${isCorrectOpt ? "text-emerald-700" : "text-rose-700"}`}>{icon}</span>}
                    </div>
                  );
                })}
              </div>
              {!ok && (
                <div className="mt-3 text-xs text-slate-600">
                  <b>Correct answer:</b> {(Array.isArray(q.answer) ? q.answer : [q.answer]).join(", ")}
                  {!noAns && (
                    <> &nbsp;·&nbsp; <b>Your answer:</b> {(Array.isArray(v) ? v : [v]).join(", ")}</>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="bg-white border border-dashed border-slate-300 rounded-xl p-10 text-center text-slate-500">
            Nothing matches this filter.
          </div>
        )}
      </div>
    </div>
  );
}

function FilterChip({ active, onClick, label, tone = "slate" }) {
  const tones = {
    slate:   active ? "bg-slate-900 text-white border-slate-900"          : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50",
    rose:    active ? "bg-rose-600 text-white border-rose-600"            : "bg-white text-rose-700 border-rose-300 hover:bg-rose-50",
    emerald: active ? "bg-emerald-600 text-white border-emerald-600"      : "bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50",
    amber:   active ? "bg-amber-500 text-white border-amber-500"          : "bg-white text-amber-700 border-amber-300 hover:bg-amber-50",
  };
  return (
    <button onClick={onClick} className={`px-3 py-1.5 rounded-md text-sm font-medium border transition ${tones[tone]}`}>
      {label}
    </button>
  );
}
