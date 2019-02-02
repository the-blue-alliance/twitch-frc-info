export const fetchEvent = (eventKey) => {
  return fetch(
    `https://www.thebluealliance.com/api/v3/event/${eventKey}`,
    {headers: {
      'X-TBA-Auth-Key': '61bdelekzYp5TY5MueT8OokJsgT1ewwLjywZnTKCAYPCLDeoNnURu1O61DeNy8z3',  // TOOD: replace
    }},
  ).then(response => {
    if (!response.ok) {
      return null;
    }
    return response.json();
  })
}