export enum MatchStatus {
  PENDING = 'PENDING',           // 대기 중 (매칭 요청됨)
  ACCEPTED = 'ACCEPTED',         // 수락됨 (경기 확정)
  REJECTED = 'REJECTED',         // 거절됨
  CANCELLED = 'CANCELLED',       // 취소됨
  IN_PROGRESS = 'IN_PROGRESS',   // 진행 중
  COMPLETED = 'COMPLETED',       // 완료됨
} 