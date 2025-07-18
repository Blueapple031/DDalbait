import { useMutation, useQuery } from '@apollo/client';
import {
  GET_MATCHES,
  GET_MATCH,
  GET_MY_MATCHES,
  GET_MATCH_LOGS,
  CREATE_MATCH,
  UPDATE_MATCH,
  DELETE_MATCH,
  ACCEPT_MATCH,
  REJECT_MATCH,
  CANCEL_MATCH,
  START_MATCH,
  COMPLETE_MATCH,
} from '../queries/match';
import {
  CREATE_MATCH as CREATE_MATCH_MUTATION,
  UPDATE_MATCH as UPDATE_MATCH_MUTATION,
  DELETE_MATCH as DELETE_MATCH_MUTATION,
  ACCEPT_MATCH as ACCEPT_MATCH_MUTATION,
  REJECT_MATCH as REJECT_MATCH_MUTATION,
  CANCEL_MATCH as CANCEL_MATCH_MUTATION,
  START_MATCH as START_MATCH_MUTATION,
  COMPLETE_MATCH as COMPLETE_MATCH_MUTATION,
} from '../mutations/match';

export interface CreateMatchInput {
  title: string;
  description?: string;
  scheduledAt: Date;
  location: string;
  locationType: string;
  latitude?: number;
  longitude?: number;
  type: string;
  maxPlayers?: number;
  rules?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
}

export interface UpdateMatchInput {
  id: string;
  title?: string;
  description?: string;
  scheduledAt?: Date;
  location?: string;
  locationType?: string;
  latitude?: number;
  longitude?: number;
  type?: string;
  status?: string;
  maxPlayers?: number;
  rules?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  opponentId?: string;
  hostScore?: number;
  opponentScore?: number;
}

export interface MatchFilterInput {
  status?: string;
  type?: string;
  locationType?: string;
  startDate?: Date;
  endDate?: Date;
  location?: string;
  hostId?: string;
  searchKeyword?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'scheduledAt' | 'updatedAt';
  sortOrder?: 'ASC' | 'DESC';
}

export interface MatchActionInput {
  matchId: string;
  reason?: string;
}

// 경기 목록 조회 훅
export function useMatches(filter?: MatchFilterInput) {
  return useQuery(GET_MATCHES, {
    variables: { filter },
    errorPolicy: 'all',
  });
}

// 경기 상세 조회 훅
export function useMatch(id: string) {
  return useQuery(GET_MATCH, {
    variables: { id },
    errorPolicy: 'all',
    skip: !id,
  });
}

// 내 경기 목록 조회 훅
export function useMyMatches(filter?: MatchFilterInput) {
  return useQuery(GET_MY_MATCHES, {
    variables: { filter },
    errorPolicy: 'all',
  });
}

// 경기 로그 조회 훅
export function useMatchLogs(matchId: string) {
  return useQuery(GET_MATCH_LOGS, {
    variables: { matchId },
    errorPolicy: 'all',
    skip: !matchId,
  });
}

// 경기 관리 훅
export function useMatchMutations() {
  const [createMatchMutation, { loading: createLoading }] = useMutation(CREATE_MATCH_MUTATION);
  const [updateMatchMutation, { loading: updateLoading }] = useMutation(UPDATE_MATCH_MUTATION);
  const [deleteMatchMutation, { loading: deleteLoading }] = useMutation(DELETE_MATCH_MUTATION);
  const [acceptMatchMutation, { loading: acceptLoading }] = useMutation(ACCEPT_MATCH_MUTATION);
  const [rejectMatchMutation, { loading: rejectLoading }] = useMutation(REJECT_MATCH_MUTATION);
  const [cancelMatchMutation, { loading: cancelLoading }] = useMutation(CANCEL_MATCH_MUTATION);
  const [startMatchMutation, { loading: startLoading }] = useMutation(START_MATCH_MUTATION);
  const [completeMatchMutation, { loading: completeLoading }] = useMutation(COMPLETE_MATCH_MUTATION);

  const createMatch = async (input: CreateMatchInput) => {
    const result = await createMatchMutation({
      variables: { input },
      refetchQueries: [GET_MATCHES, GET_MY_MATCHES],
    });
    return result;
  };

  const updateMatch = async (input: UpdateMatchInput) => {
    const result = await updateMatchMutation({
      variables: { input },
      refetchQueries: [GET_MATCHES, GET_MY_MATCHES, GET_MATCH],
    });
    return result;
  };

  const deleteMatch = async (id: string) => {
    const result = await deleteMatchMutation({
      variables: { id },
      refetchQueries: [GET_MATCHES, GET_MY_MATCHES],
    });
    return result;
  };

  const acceptMatch = async (input: MatchActionInput) => {
    const result = await acceptMatchMutation({
      variables: { input },
      refetchQueries: [GET_MATCHES, GET_MY_MATCHES, GET_MATCH],
    });
    return result;
  };

  const rejectMatch = async (input: MatchActionInput) => {
    const result = await rejectMatchMutation({
      variables: { input },
      refetchQueries: [GET_MATCHES, GET_MY_MATCHES, GET_MATCH],
    });
    return result;
  };

  const cancelMatch = async (input: MatchActionInput) => {
    const result = await cancelMatchMutation({
      variables: { input },
      refetchQueries: [GET_MATCHES, GET_MY_MATCHES, GET_MATCH],
    });
    return result;
  };

  const startMatch = async (id: string) => {
    const result = await startMatchMutation({
      variables: { id },
      refetchQueries: [GET_MATCHES, GET_MY_MATCHES, GET_MATCH],
    });
    return result;
  };

  const completeMatch = async (id: string, hostScore?: number, opponentScore?: number) => {
    const result = await completeMatchMutation({
      variables: { id, hostScore, opponentScore },
      refetchQueries: [GET_MATCHES, GET_MY_MATCHES, GET_MATCH],
    });
    return result;
  };

  const loading = createLoading || updateLoading || deleteLoading || 
                   acceptLoading || rejectLoading || cancelLoading ||
                   startLoading || completeLoading;

  return {
    createMatch,
    updateMatch,
    deleteMatch,
    acceptMatch,
    rejectMatch,
    cancelMatch,
    startMatch,
    completeMatch,
    loading,
  };
} 