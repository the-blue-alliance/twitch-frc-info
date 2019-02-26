const TBA_AUTH_KEY = '61bdelekzYp5TY5MueT8OokJsgT1ewwLjywZnTKCAYPCLDeoNnURu1O61DeNy8z3'  // TOOD: replace

export const fetchEvent = (eventKey) => {
  return fetch(
    `https://www.thebluealliance.com/api/v3/event/${eventKey}`,
    {headers: {
      'X-TBA-Auth-Key': TBA_AUTH_KEY,
    }},
  ).then(response => {
    if (!response.ok) {
      return null;
    }
    return response.json();
  })
}

export const fetchTeams = (eventKey) => {
  return fetch(
    `https://www.thebluealliance.com/api/v3/event/${eventKey}/teams`,
    {headers: {
      'X-TBA-Auth-Key': TBA_AUTH_KEY
    }},
  ).then(response => {
    if (!response.ok) {
      return null;
    }
    return response.json();
  })
}

export const fetchMatches = (eventKey) => {
  return fetch(
    `https://www.thebluealliance.com/api/v3/event/${eventKey}/matches`,
    {headers: {
      'X-TBA-Auth-Key': TBA_AUTH_KEY
    }},
  ).then(response => {
    if (!response.ok) {
      return null;
    }
    return response.json();
  })
}

export const fetchTeamMedia = (teamKey, year) => {
  return fetch(
    `https://www.thebluealliance.com/api/v3/team/${teamKey}/media/${year}`,
    {headers: {
      'X-TBA-Auth-Key': TBA_AUTH_KEY
    }},
  ).then(response => {
    if (!response.ok) {
      return null;
    }
    return response.json();
  })
}

export const fetchRankings = (eventKey) => {
  return fetch(
    `https://www.thebluealliance.com/api/v3/event/${eventKey}/rankings`,
    {headers: {
      'X-TBA-Auth-Key': TBA_AUTH_KEY,
    }},
  ).then(response => {
    if (!response.ok) {
      return null;
    }
    return response.json();
  })
}
