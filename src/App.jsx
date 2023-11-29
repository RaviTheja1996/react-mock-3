import "./App.css";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  HStack,
  Box,
  Image,
  VStack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useDisclosure,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Select,
} from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon, Search2Icon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { MdArrowDropDown } from "react-icons/md";
import axios from "axios";

function App() {
  const baseURL = "https://api.coingecko.com/api/v3/coins/markets";
  const [data, setData] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [page, setPage] = useState(1);
  const [currency, setCurrency] = useState("INR");
  const [currentRow, setCurrentRow] = useState({});
  const [searchKey, setSearchKey] = useState("");
  const [sortCriteria, setSortCriteria] = useState("market_cap_desc");
  const [locale, setLocale] = useState("en-IN");

  useEffect(() => {
    axios
      .get(
        `${baseURL}?vs_currency=${currency}&per_page=10&page=${page}&order=${sortCriteria}`
      )
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      });
  }, [page, currency, sortCriteria]);

  const prevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const nextPage = () => {
    setPage((prev) => prev + 1);
  };

  const handleRow = (data) => {
    setCurrentRow(data);
    onOpen();
  };

  const handleSearch = () => {
    let res = data?.filter((el) => {
      if (el.name === searchKey) {
        return true;
      }
    });
    res.length > 0 && handleRow(res[0]);
  };

  return (
    <>
      <VStack spacing={6}>
        <HStack w="60%" mx="auto" mb="1rem">
          <InputGroup size="md">
            <Input
              placeholder="Enter coin name"
              value={searchKey}
              onChange={(e) => {
                setSearchKey(e.target.value);
              }}
            ></Input>
            <InputRightElement>
              <Button onClick={handleSearch}>
                <Icon as={Search2Icon}></Icon>
              </Button>
            </InputRightElement>
          </InputGroup>
        </HStack>
        <HStack spacing={6}>
          <Text fontSize="lg">Sort : </Text>
          <Select
            placeholder="Select market cap sorting order"
            variant="filled"
            icon={<MdArrowDropDown />}
            onChange={(e) => {
              setSortCriteria(e.target.value);
            }}
          >
            <option value="market_cap_asc">Ascending Order</option>
            <option value="market_cap_desc">Descending Order</option>
          </Select>
        </HStack>
        <HStack spacing={6}>
          <Text fontSize="lg">Currency : </Text>
          <Select
            placeholder="Select currency"
            variant="filled"
            icon={<MdArrowDropDown />}
            onChange={(e) => {
              setCurrency(e.target.value.split(" ")[0]);
              setLocale(e.target.value.split(" ")[1]);
            }}
          >
            <option value="INR en-IN">INR</option>
            <option value="USD en-US">USD</option>
            <option value="EUR de-DE">EUR</option>
          </Select>
        </HStack>
      </VStack>
      <TableContainer>
        <Table>
          <TableCaption>crypto coin data table</TableCaption>
          <Thead bgColor="#eebc1d">
            <Tr>
              <Th fontSize={"lg"}>Coin</Th>
              <Th fontSize={"lg"}>Price</Th>
              <Th fontSize={"lg"}>24h change</Th>
              <Th fontSize={"lg"}>Market Cap</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.map((el, ind) => {
              return (
                <Tr
                  key={ind}
                  bgColor={"#30302F"}
                  color={"white"}
                  onClick={() => {
                    handleRow(el);
                  }}
                >
                  <Td>
                    <HStack spacing={4}>
                      <Box w="3.2rem" h="3.2rem">
                        <Image src={el.image} />
                      </Box>
                      <VStack spacing={4} align={"start"}>
                        <Text fontSize={"2xl"}>{el.symbol.toUpperCase()}</Text>
                        <Text fontSize={"md"}>{el.name}</Text>
                      </VStack>
                    </HStack>
                  </Td>
                  <Td>
                    <Text>{`₹${el.current_price.toLocaleString(locale)}`}</Text>
                  </Td>
                  <Td>
                    <Text color={"lightgreen"}>
                      {`${parseFloat(el.price_change_percentage_24h).toFixed(
                        2
                      )}%`}
                    </Text>
                  </Td>
                  <Td>
                    <Text>{`₹${el.market_cap.toLocaleString(locale)}`}</Text>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      <HStack spacing={4} mx={"auto"} w="8rem" mt="1rem">
        <Icon
          as={ArrowBackIcon}
          boxSize="2rem"
          style={{ cursor: "pointer" }}
          onClick={prevPage}
        />
        <Text>{page}</Text>
        <Icon
          as={ArrowForwardIcon}
          boxSize="2rem"
          style={{ cursor: "pointer" }}
          onClick={nextPage}
        />
      </HStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bgColor={"#30302F"} color={"white"}>
            Coin Details
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody bgColor={"#30302F"} color={"white"}>
            <VStack spacing={6} fontSize="xl">
              <Text>{`market_cap_rank : ${currentRow.market_cap_rank}`}</Text>
              <Box w="3.2rem" h="3.2rem">
                <Image src={currentRow.image} />
              </Box>
              <Text>{`name : ${currentRow.name}`}</Text>
              <Text>{`symbol : ${currentRow.symbol}`}</Text>
              <Text>{`current_price : ₹${currentRow.current_price}`}</Text>
              <Text>{`price_change_24h : ₹${currentRow.price_change_24h?.toLocaleString(
                locale
              )}`}</Text>
              <Text>{`total_volume : ${currentRow.total_volume?.toLocaleString(
                locale
              )}`}</Text>
              <Text>{`low_24h : ${currentRow.low_24h?.toLocaleString(
                locale
              )}`}</Text>
              <Text>{`high_24h : ${currentRow.high_24h?.toLocaleString(
                locale
              )}`}</Text>
              <Text>{`total_supply : ${currentRow.total_supply?.toLocaleString(
                locale
              )}`}</Text>
              <Text>{`max_supply : ${currentRow.max_supply?.toLocaleString(
                locale
              )}`}</Text>
              <Text>{`circulating_supply : ${currentRow.circulating_supply?.toLocaleString(
                locale
              )}`}</Text>
              <Text>{`All Time High(ath) : ₹${currentRow.ath?.toLocaleString(
                locale
              )}`}</Text>
              <Text>{`last_updated : ${currentRow.last_updated}`}</Text>
            </VStack>
          </ModalBody>
          <ModalFooter bgColor={"#30302F"} color={"white"}>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default App;
