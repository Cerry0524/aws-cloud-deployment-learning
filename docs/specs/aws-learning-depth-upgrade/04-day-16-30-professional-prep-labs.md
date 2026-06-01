# Stage 04: Day 16-30 Professional Prep Labs

## 目標

把 Day 16-30 從「高階主題列表」升級成 Professional prep / Specialty intro 的架構審查與營運訓練。

## 階段能力

完成本階段後，學員應能：

- 用 AWS Well-Architected 角度審查 production architecture。
- 對安全、可靠性、效能、成本、營運提出 trade-off。
- 設計 migration、DR、rollback、incident、release governance。
- 做 final architecture defense。

## Day 16-30 規格表

| Day | 主題 | 必備 lab artifact | 能力定位 |
|---:|---|---|---|
| 16 | Production Security Hardening | IAM/SG/CORS/APP_DEBUG audit checklist | Security Specialty intro |
| 17 | Multi-tenant Architecture | tenant isolation model、data boundary table | SaaS architecture |
| 18 | RDS Migration Strategy | migration runbook、backup/rollback plan | DevOps Pro prep |
| 19 | S3 Upload and Signed URL | private upload flow、signed URL policy | Security / SAA |
| 20 | WebSocket / Reverb on AWS | ALB WebSocket routing、Redis pub/sub diagram | Advanced app deployment |
| 21 | High-concurrency Ticket Booking | lock/transaction/queue consistency decision table | Performance / reliability |
| 22 | Autoscaling and Capacity | ECS scaling policy、queue depth scaling model | CloudOps / DevOps |
| 23 | Cost Optimization | NAT/RDS/Fargate/CloudWatch cost review | Cost pillar |
| 24 | Disaster Recovery Runbook | RPO/RTO table、restore procedure | Reliability pillar |
| 25 | IaC Overview | Terraform/CDK module boundary map | DevOps Pro prep |
| 26 | Release Governance | approval、change log、audit trail | Governance |
| 27 | Performance Review | N+1/cache/queue latency checklist | Performance pillar |
| 28 | Final Architecture Review | Well-Architected review checklist | SAA/SA Pro prep |
| 29 | Portfolio Deployment Report | deployment report、diagram、cost estimate | Portfolio |
| 30 | Capstone Defense | 20-minute defense script、Q&A bank | Defense Ready |

## Deep Dive 每日固定格式

```text
Production risk
-> Current architecture assumption
-> Failure mode
-> Detection
-> Remediation
-> Preventive control
-> Evidence artifact
-> Defense question
```

## Day 24 DR 範例規格

Scenario：

Production database accidentally receives bad migration. 今天要設計 RPO/RTO、RDS snapshot restore、S3 versioning、rollback checklist。

Commands：

```bash
aws rds describe-db-snapshots --db-instance-identifier ticketfactory-prod
aws rds restore-db-instance-from-db-snapshot --db-instance-identifier ticketfactory-restore --db-snapshot-identifier <snapshot-id>
aws s3api get-bucket-versioning --bucket <uploads-bucket>
```

Artifact：

- RPO/RTO table
- restore runbook
- restore validation checklist
- incident communication note

## Day 30 Capstone 範例規格

Capstone 必須回答：

1. 你的 Docker Compose 如何拆到 AWS？
2. 哪些服務是 stateless？哪些是 stateful？
3. 你的 RDS、S3、Redis 為什麼不能放在 container local disk？
4. 你的 deployment 如何 rollback？
5. 你的 ALB/ECS health check 如何判斷服務可用？
6. 你的 secrets 如何管理？
7. 你的 DR 策略 RPO/RTO 是什麼？
8. 你的成本最大來源是什麼？
9. 你的 security group 是否 least privilege？
10. 如果主管問你「這能上 production 嗎？」你如何回答？

## 驗收標準

- Deep Dive 不只列名詞，必須有 failure mode、detection、remediation。
- Day 30 能產生完整 architecture defense。
- 完成本階段後，學員至少達到 L4 Professional Prep，若能補足真實 AWS 實作 evidence，可接近 L5 Defense Ready。

