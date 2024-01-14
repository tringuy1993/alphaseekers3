import { Box, Divider, List, Text, Title } from '@mantine/core';

import classes from './styles.about.module.css';

export function ProjectAS() {
  return (
    <Box>
      <Divider
        my="xl"
        size="xl"
        variant="dashed"
        label={<Title size="30">Project: Alpha-Seekers</Title>}
        labelPosition="center"
      />
      <Text className={classes.textParagraph}>
        This project is the birth of my fullstack development. Dash plotly was good to visualize
        data and quickly deploy on Heroku. However, I quickly realized some drawbacks on my codes
        below:
      </Text>
      <Box className={classes.textParagraph}>
        <List type="ordered">
          <List.Item>
            My plots cannot display semi-live data to multiple clients because the data API is
            directly fetched from the source. Additionally, there is a limit on # of requests from
            data API endpoint.
          </List.Item>
          <List.Item>
            My code structure quickly got out of hand with no organization and at times, it gets
            harder to debug.
          </List.Item>
          <List.Item>
            I do not know how Heroku works other than following some tutorial. In my opinion, it is
            beneficial to understand how Heroku works.
          </List.Item>
        </List>
        <br />I deployed the following solutions below for each problem above:
        <List type="ordered">
          <List.Item>
            I utilize Django and Django RestFrameWork as my backend and server to create my own API
            endpoint. My API endpoint fetches and compute all the neccessary data continuously with
            crontab scheduler via Celery Beat. In this way, my frontend is more responsive without
            the need of computing data.
          </List.Item>
          <List.Item>
            I utilize React as my webframework to have better coding structures along with reusable
            components that I do not have to repeat myself.
          </List.Item>
          <List.Item>
            It urks me that I do not understand how Heroku works. I have a personal NAS and I found
            out that I can host my website on my NAS! I learned how to deploy my website{' '}
            <a href="www.alpha-seekers.com">Alpha-Seekers</a> on my virtual machine with Nginx
            (React) and Gunicorn (Django) via a linux server on my NAS.
          </List.Item>
        </List>
      </Box>
    </Box>
  );
}
