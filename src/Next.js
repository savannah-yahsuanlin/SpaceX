import "./App.css";
import React from "react";
import { useQuery, gql } from "@apollo/client";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

export const nextPage = gql`
  query nextPage {
    launchNext {
      launch_date_local
      id
      launch_site {
        site_name_long
      }
      launch_success
      links {
        article_link
        video_link
      }
      rocket {
        rocket_name
        rocket_type
      }
      details
      mission_name
    }
  }
`;

const Next = () => {
  const { loading, error, data } = useQuery(nextPage);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <>
      {Object.entries(data).map(([key, value]) => {
        return (
          <Box key={value.id} sx={{ padding: "50px" }}>
            <Typography variant="h4">
              {key.slice(0, 1).toUpperCase() + key.slice(1, key.length)}
            </Typography>
            <Grid container>
              <Grid item sm={12} md={6} key={value.id}>
                <Typography variant="h6">
                  {value.id}-{value.mission_name}
                </Typography>
                <Typography variant="subtitle1">
                  {value.launch_site.site_name_long}
                </Typography>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>{value.links.__typename}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-around",
                      }}
                    >
                      <Typography variant="h6">
                        <Link href={value.links.article_link}>Article</Link>
                      </Typography>
                      {value.links.video_link === null ? (
                        <Typography>No video</Typography>
                      ) : (
                        <iframe
                          width="300"
                          height="200"
                          src={
                            `https://www.youtube.com/embed/` +
                            value.links.video_link.split(".be/")[1] +
                            `?autoplay=1`
                          }
                          title={value.name}
                        ></iframe>
                      )}
                    </Box>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>{value.rocket.__typename}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="h6">
                      {value.rocket.rocket_name}
                    </Typography>
                    <Typography variant="body2">
                      {value.rocket.rocket_type}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Stack direction="column" spacing={4}>
                  <Button
                    variant="contained"
                    color={value.launch_success ? "success" : "error"}
                  >
                    {value.launch_success === true ? "succeeded" : "failed"}
                  </Button>
                </Stack>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>Details</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2">{value.details}</Typography>
                  </AccordionDetails>
                </Accordion>
                <Stack direction="row" spacing={10}>
                  <Typography variant="body2">Launch Date</Typography>
                  <Typography variant="subtitle2">
                    {value.launch_date_local.slice(0, 10)}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        );
      })}
    </>
  );
};

export default Next;
