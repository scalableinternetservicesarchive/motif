/**
 * All of our CC URL routes. You may navigate to any route by providing the route
 * and an argument specifying all it's route params, e.g. { taskId: 1, contactId: 3}.
 *
 * Some routes are special values that map to one of the other routes depending on current location context.
 */
export enum Route {
  HOME = 'app/index',
  LobbySearch = 'app/LobbySearch',
  LobbyWait = 'app/LobbyWait',
  LobbyMain = 'app/Lobby',
  BOARD = 'app/board',
  USER_LOGIN = 'app/UserLogin',
  Lobby_Inst = 'app/LobbyWait/:lobby',
  Game_Inst = 'app/board/:game',
}

export function getLobbyPath(lobbyId?: number) {
  const path = getPath(Route.Lobby_Inst, { lobby: 'lobby' })
  return path + (lobbyId ? `?lobbyId=${lobbyId}` : '')
}

export function getGamePath(lobbyId?: number) {
  const path = getPath(Route.Game_Inst, { game: 'game' })
  return path + (lobbyId ? `?lobbyId=${lobbyId}` : '')
}

export function getLobbyMainPath() {
  return getPath(Route.LobbyMain)
}

export function getLobbySearchPath() {
  return getPath(Route.LobbySearch)
}

export function getLobbyWaitPath() {
  return getPath(Route.LobbyWait)
}

export function getBoardPath() {
  return getPath(Route.BOARD)
}

export function getUserLoginPath() {
  return getPath(Route.USER_LOGIN)
}
/**
 * Example: getPath(ROUTES.TASK) returns "/leasing/tasks" while getPath(ROUTES.TASK, {taskId: 5}) returns "leasing/tasks/task/5".
 *
 * CAVEAT: currently this reads from window.location, the appropriate way to get location is through @reach/router.
 */
export function getPath(route: Route, arg?: Partial<ReturnType<typeof routeParams>>) {
  const routes = [route] as Route[]

  for (const r of routes) {
    const params = r.split('/').filter(t => t.startsWith(':'))
    const keys = arg ? Object.keys(arg) : []
    const paramMatches = params.map(p => keys.includes(p.replace(':', ''))).filter(m => m)
    if (keys.length !== params.length || paramMatches.length < params.length) {
      continue // every parameter must be replaced
    }

    // matching case: arg specifies all params in the URL
    let path = r.toString()
    for (const k of keys) {
      path = path.replace(':' + k, '' + (arg as any)[k])
    }
    return '/' + path
  }

  throw new Error('no matching route')
}

/**
 * Represents parameters parsed from URL routes, e.g. /leasing/tasks/task/123 parses taskId=123.
 */
export interface AppRouteParams {
  userId?: string
  lobby?: string
  game?: string
}

/**
 * Parses string route params into numbers. Values are 0 where undefined. Useful for converting URL parameters into GraphQL query variables.
 */
export function routeParams(params: AppRouteParams) {
  return {
    userId: Number(params.userId || 0),
    lobby: String(params.lobby || ''),
    game: String(params.game || ''),
  }
}
