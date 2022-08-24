import "./App.css";
import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { client } from "./index";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea } from "@mui/material";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const currentPage = gql`
  query currentPage($limit: Int!, $offset: Int!) {
    launchesPast(limit: $limit, offset: $offset) {
      id
      mission_name
      launch_date_local
      launch_site {
        site_name_long
      }
      ships {
        name
        home_port
        image
      }
      links {
        article_link
        video_link
      }
      rocket {
        rocket_name
        rocket_type
      }
      launch_success
      details
    }
  }
`;

const PAGE_SIZE = 5;

const Listing = () => {
  const [page, setPage] = useState(0);
  const { loading, error, data } = useQuery(currentPage, {
    client,
    variables: {
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
        <Button disabled={!page} onClick={() => setPage((prev) => prev - 1)}>
          <ArrowBackIosNewIcon />
        </Button>
        <Typography>{page + 1}</Typography>
        <Button disabled={page} onClick={() => setPage((prev) => prev + 1)}>
          <ArrowForwardIosIcon />
        </Button>
      </Box>
      {Object.entries(data).map(([key, value]) => {
        return (
          <Box key={value} sx={{ padding: "50px" }}>
            <Grid container rowSpacing={3} columnSpacing={6}>
              {value.map((entry) => {
                return (
                  <Grid item sm={6} md={6} key={entry.id}>
                    <Typography variant="h6">
                      {entry.id}-{entry.mission_name}
                    </Typography>
                    <Typography variant="subtitle1">
                      {entry.launch_site.site_name_long}
                    </Typography>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography>Ships</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        {entry.ships.map((ele) => {
                          return (
                            <Box
                              sx={{
                                float: "left",
                                marginLeft: "50px",
                                marginBottom: "10px",
                              }}
                              key={ele.name}
                            >
                              <Card sx={{ maxWidth: 200 }}>
                                <CardActionArea>
                                  <CardMedia
                                    component="img"
                                    height="140"
                                    image={ele.image}
                                    alt={ele.name}
                                  />
                                  <CardContent>
                                    <Typography
                                      gutterBottom
                                      variant="subtitle1"
                                      component="div"
                                    >
                                      {ele.name}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      {ele.home_port}
                                    </Typography>
                                  </CardContent>
                                </CardActionArea>
                              </Card>
                            </Box>
                          );
                        })}
                      </AccordionDetails>
                    </Accordion>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography>{entry.links.__typename}</Typography>
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
                            <Link href={entry.links.article_link}>Article</Link>
                          </Typography>

                          <iframe
                            width="300"
                            height="200"
                            src={
                              `https://www.youtube.com/embed/` +
                              entry.links.video_link.split(".be/")[1] +
                              `?autoplay=1`
                            }
                            title={entry.name}
                          ></iframe>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography>{entry.rocket.__typename}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="h6">
                          {entry.rocket.rocket_name}
                        </Typography>
                        <Typography variant="body2">
                          {entry.rocket.rocket_type}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                    <Stack direction="column" spacing={4}>
                      <Button
                        variant="contained"
                        color={entry.launch_success ? "success" : "error"}
                      >
                        {entry.launch_success === true ? "succeeded" : "failed"}
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
                        <Typography variant="body2">{entry.details}</Typography>
                      </AccordionDetails>
                    </Accordion>
                    <Stack direction="row" spacing={10}>
                      <Typography variant="body2">Launch Date</Typography>
                      <Typography variant="subtitle2">
                        {entry.launch_date_local.slice(0, 10)}
                      </Typography>
                    </Stack>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        );
      })}
    </>
  );
};

export default Listing;
