const TBA_AUTH_KEY = 'EpSdC0FOdvkX9DjiXnrEVVAKCTsG0jbHWugC5Drwxu0C7HtmMJ0ais7gl91uFgdi'

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
