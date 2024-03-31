import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import PacmanLoader from "react-spinners/PacmanLoader";
import { useQuery } from "@tanstack/react-query";

import {
  Progress,
  Box,
  ButtonGroup,
  Button,
  Heading,
  Flex,
  FormControl,
  Radio,
  RadioGroup,
  Stack,
  Center,
} from "@chakra-ui/react";

import { useToast } from "@chakra-ui/react";

export default function CFoms() {
  const [searchParams] = useSearchParams();
  const [points, setPoints] = useState(0);
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState();
  const [tempState, setTempState] = useState(undefined);

  const topics = searchParams.get("topics");
  const URL = `https://7ps9dmu676.execute-api.us-east-1.amazonaws.com/ai?topics=${topics}`;

  const fetchResponse = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const res = await fetch(URL);
      return res.json();
    },
    retry: false,
    retryOnMount: false,
  });

  const handelNext = (item) => {
    if (item.correct_answer == tempState) {
      setPoints(points + 1);
    } else if (points != 0) {
      setPoints(points - 1);
    }
    setTempState(undefined);
    setProgress(((step + 1) / fetchResponse?.data.length) * 100);
    if (step == fetchResponse?.data.length - 1) {
      toast({
        title: `points ${points} / ${fetchResponse?.data.length}`,
        description: "Let's do it again",
        status: "success",
        isClosable: true,
        position: "top",
        onCloseComplete: () => {
          window.location = "/";
        },
      });
    } else {
      setStep(step + 1);
    }
  };
  if (fetchResponse.isLoading)
    return (
      <Center marginTop={"20%"} h="100px" color="white">
        <PacmanLoader size={40} color={"#61dfed"} />
      </Center>
    );
  if (fetchResponse.isError) {
    return <div>Errors</div>;
  }
  console.log(typeof (fetchResponse?.data));
  if (typeof(fetchResponse?.data?.filter) == Function) {
    return <div>please refresh the page</div>;
  }
  
  return (
    <>
      {/* {fetchResponse?.data
        ?.filter((_, i) => i == step)
        ?.map((item, index) => {
          return (
            <Box
              key={`${index}-${item.question}`}
              borderWidth="1px"
              rounded="lg"
              shadow="1px 1px 3px rgba(0,0,0,0.3)"
              maxWidth={800}
              p={6}
              m="10px auto"
              as="form"
              mt={"8%"}
            >
              <Progress
                hasStripe
                value={progress}
                mb="5%"
                mx="5%"
                isAnimated
              ></Progress>

              <div>
                <Heading
                  w="100%"
                  textAlign={"center"}
                  fontWeight="normal"
                  mb="2%"
                >
                  {item.question}
                </Heading>
                <FormControl mt="2%">
                  <RadioGroup
                    onClick={(e) => {
                      setTempState(e.target.value);
                    }}
                  >
                    <Stack>
                      {item.answers.map((option, i) => {
                        return (
                          <Radio value={option} key={option + i}>
                            {option}
                          </Radio>
                        );
                      })}
                    </Stack>
                  </RadioGroup>
                </FormControl>
              </div>
              <ButtonGroup mt="5%" w="100%">
                <Flex w="100%" justifyContent="space-between">
                  {fetchResponse?.data[fetchResponse?.data.length - 1]
                    .question === item.question ? (
                    <Button
                      w="7rem"
                      colorScheme="red"
                      variant="solid"
                      onClick={() => handelNext(item)}
                    >
                      Submit
                    </Button>
                  ) : (
                    <Button
                      isDisabled={
                        fetchResponse?.data[fetchResponse?.data.length - 1]
                          .question === item.question
                      }
                      w="7rem"
                      onClick={() => handelNext(item)}
                      colorScheme="teal"
                      variant="outline"
                    >
                      Next
                    </Button>
                  )}
                </Flex>
              </ButtonGroup>
            </Box>
          );
        })} */}
    </>
  );
}
