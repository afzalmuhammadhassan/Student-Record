import { useState, useEffect } from "react";
import * as React from "react";
import { styled } from "@mui/material/styles";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  TableContainer,
  TableCell,
  Paper,
  TableBody,
  Box,
  Button,
  Table,
  tableCellClasses,
} from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontWeight: 10,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function createData(roll_number, name, c_class, grade, school) {
  return { roll_number, name, c_class, grade, school };
}

const StudentTable = () => {
  const [rows, setRows] = useState([]);

  const handleRemove = (id) => {
    const newRows = rows.filter((item) => item.roll_number !== id);
    setRows(newRows);
  };
  const getStudentInfo = async () => {
    const uri =
      "https://4smoldeim6.execute-api.ap-northeast-1.amazonaws.com/dev/";
    try {
      const studentData = await fetch(uri, {
        method: "PATCH",
      });
      const response = await studentData.json();
      return response;
    } catch (error) {
      throw new Error(`Message: ${error.message}`);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getStudentInfo();

        const newRows = data.map((item) => {
          const { roll_number, name, c_class, grade, school } = item;
          const obj = createData(
            roll_number.N,
            name.S,
            c_class.S,
            grade.S,
            school.S
          );
          return obj;
        });
        setRows((prev) => {
          let updateRows = [...prev];
          newRows.forEach((item) => {
            updateRows.push(item);
          });
          return updateRows;
        });
      } catch (error) {
        console.error("Error fetching student info:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>ROLL NO.</StyledTableCell>
              <StyledTableCell>NAME</StyledTableCell>
              <StyledTableCell>CLASS</StyledTableCell>
              <StyledTableCell>GRADE</StyledTableCell>
              <StyledTableCell>SCHOOL</StyledTableCell>
              <StyledTableCell align="center">REMOVE</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell>{row.roll_number}</StyledTableCell>
                <StyledTableCell>{row.name}</StyledTableCell>
                <StyledTableCell>{row.c_class}</StyledTableCell>
                <StyledTableCell>{row.grade}</StyledTableCell>
                <StyledTableCell>{row.school}</StyledTableCell>
                <StyledTableCell align="center">
                  <Button
                    variant="contained"
                    onClick={() => handleRemove(row.roll_number)}
                  >
                    REMOVE
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default StudentTable;
