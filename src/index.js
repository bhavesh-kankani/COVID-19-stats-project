import React from "react";
import ReactDOM from "react-dom";
import "./reset.css";
import "./index.css";
import Chart from "react-google-charts";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav } from "react-bootstrap";
import corona from "./corona.jpg";

class NavigationBar extends React.Component {
	loadGlobal() {
		ReactDOM.render(
			<React.StrictMode>
				<Global />
			</React.StrictMode>,
			document.getElementById("root")
		);
	}

	loadNational() {
		ReactDOM.render(
			<React.StrictMode>
				<National />
			</React.StrictMode>,
			document.getElementById("root")
		);
	}

	loadAbout() {
		ReactDOM.render(
			<React.StrictMode>
				<About />
			</React.StrictMode>,
			document.getElementById("root")
		);
	}

	render() {
		return (
			<div>
				<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
					<Navbar.Brand href="#home">
						COVID-19 STATISTICS
					</Navbar.Brand>
					<Navbar.Toggle aria-controls="responsive-navbar-nav" />
					<Navbar.Collapse
						id="responsive-navbar-nav"
						className="navbar"
					>
						<Nav className="mr-auto">
							<Nav.Link
								onClick={this.loadGlobal}
								className="navbar"
							>
								Global
							</Nav.Link>
							<Nav.Link
								onClick={this.loadNational}
								className="navbar"
							>
								National
							</Nav.Link>
							<Nav.Link
								onClick={this.loadAbout}
								className="navbar"
							>
								About COVID-19
							</Nav.Link>
						</Nav>
					</Navbar.Collapse>
				</Navbar>
			</div>
		);
	}
}

class Global extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			items: [],
			isLoaded: false,
		};
	}

	componentDidMount() {
		fetch("https://api.covid19api.com/summary")
			.then((res) => res.json())
			.then((json) => {
				this.setState({
					isLoaded: true,
					items: json,
				});
			});
	}

	render() {
		var { isLoaded, items } = this.state;
		function completeData(items) {
			console.log(items);
			var rawData = [["Country Code", "Country", "Confirmed"]];
			for (let i in items.Countries) {
				rawData.push([
					items.Countries[i].CountryCode,
					items.Countries[i].Country,
					items.Countries[i].TotalConfirmed,
				]);
			}
			return rawData;
		}

		function tableData(items) {
			var tableData = [
				[
					{ type: "string", label: "COUNTRY  " },
					{ type: "number", label: "CONFIRMED" },
					{ type: "number", label: "ACTIVE" },
					{ type: "number", label: "RECOVERED" },
					{ type: "number", label: "DECEASED" },
				],
			];

			for (let i in items.Countries) {
				tableData.push([
					items.Countries[i].Country,
					items.Countries[i].TotalConfirmed,
					items.Countries[i].TotalConfirmed -
						(items.Countries[i].TotalRecovered +
							items.Countries[i].TotalDeaths),
					items.Countries[i].TotalRecovered,
					items.Countries[i].TotalDeaths,
				]);
			}
			return tableData;
		}

		if (!isLoaded) {
			return <div>Loading...</div>;
		} else {
			return (
				<div>
					<NavigationBar />
					<h1>GLOBAL STATISTICS</h1>
					<p>
						<label style={{ color: "#fe073a" }}>
							Confirmed:{" "}
							{items.Global.TotalConfirmed.toLocaleString(
								"en-IN"
							)}
						</label>
						&emsp;{" "}
						<label style={{ color: "#007bfe" }}>
							Active:{" "}
							{(
								items.Global.TotalConfirmed -
								(items.Global.TotalRecovered +
									items.Global.TotalDeaths)
							).toLocaleString("en-IN")}
						</label>
						&emsp;{" "}
						<label style={{ color: "#28a645" }}>
							Recovered:{" "}
							{items.Global.TotalRecovered.toLocaleString(
								"en-IN"
							)}
						</label>
						&emsp;{" "}
						<label style={{ color: "#6c757d" }}>
							Deceased:{" "}
							{items.Global.TotalDeaths.toLocaleString("en-IN")}
						</label>
					</p>
					<Chart
						style={{
							margin: "0px auto",
							paddingTop: "25px",
							paddingBottom: "10vh",
						}}
						chartType="GeoChart"
						data={completeData(items)}
						rootProps={{ "data-testid": "1" }}
						options={{
							width: "100vw",
							height: "75vh",
							colorAxis: { colors: ["#FF5959", "#FF0000"] },
							backgroundColor: "#161625",
							legend: "none",
							datalessRegionColor: "#161625",
						}}
					/>
					<Chart
						style={{
							margin: "0px auto",
						}}
						chartType="Table"
						loader={<div>Loading Chart</div>}
						data={tableData(items)}
						options={{
							showRowNumber: true,
							height: "100%",
							width: "75vw",
							sortColumn: 1,
							sortAscending: false,
							allowHTML: true,
							cssClassNames: {
								headerRow: "header-row",
								tableRow: "table-row",
								headerCell: "header-cell",
								tableCell: "table-cell",
							},
						}}
					/>
				</div>
			);
		}
	}
}

class National extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			items: [],
			isLoaded: false,
		};
	}

	componentDidMount() {
		fetch("https://api.covid19india.org/data.json")
			.then((res) => res.json())
			.then((json) => {
				this.setState({
					isLoaded: true,
					items: json,
				});
			});
	}

	render() {
		var { isLoaded, items } = this.state;

		function completeData(items) {
			var rawData = [["State", "Confirmed"]];

			var telangana = [];
			for (let i in items.statewise) {
				if (items.statewise[i].state === "Telangana") {
					telangana.push(items.statewise[i].state);
					telangana.push(items.statewise[i].confirmed);
				}
			}

			for (let i in items.statewise) {
				if (String(items.statewise[i].state) !== "Total") {
					if (items.statewise[i].state === "Andhra Pradesh") {
						console.log(telangana[1]);
						rawData.push([
							{
								v: "IN-" + items.statewise[i].statecode,
								f:
									items.statewise[i].state +
									"+" +
									telangana[0],
							},
							Number(items.statewise[i].confirmed) +
								Number(telangana[1]),
						]);
					} else {
						rawData.push([
							{
								v: "IN-" + items.statewise[i].statecode,
								f: items.statewise[i].state,
							},
							Number(items.statewise[i].confirmed),
						]);
					}
				}
			}
			return rawData;
		}

		function tableData(items) {
			var tableData = [
				[
					{ type: "string", label: "STATE" },
					{ type: "number", label: "CONFIRMED" },
					{ type: "number", label: "ACTIVE" },
					{ type: "number", label: "RECOVERED" },
					{ type: "number", label: "DECEASED" },
				],
			];

			for (let i in items.statewise) {
				if (items.statewise[i].state !== "Total") {
					tableData.push([
						items.statewise[i].state,
						Number(items.statewise[i].confirmed),
						Number(items.statewise[i].active),
						Number(items.statewise[i].recovered),
						Number(items.statewise[i].deaths),
					]);
				}
			}
			return tableData;
		}

		if (!isLoaded) {
			return <div>Loading...</div>;
		} else {
			return (
				<div>
					<NavigationBar />
					<h1>NATIONAL STATISTICS</h1>
					<p>
						<label style={{ color: "#fe073a" }}>
							Confirmed:{" "}
							{Number(
								items.statewise[0].confirmed
							).toLocaleString("en-IN")}
						</label>
						&emsp;{" "}
						<label style={{ color: "#007bfe" }}>
							Active:{" "}
							{Number(items.statewise[0].active).toLocaleString(
								"en-IN"
							)}
						</label>
						&emsp;{" "}
						<label style={{ color: "#28a645" }}>
							Recovered:{" "}
							{Number(
								items.statewise[0].recovered
							).toLocaleString("en-IN")}
						</label>
						&emsp;{" "}
						<label style={{ color: "#6c757d" }}>
							Deceased:{" "}
							{Number(items.statewise[0].deaths).toLocaleString(
								"en-IN"
							)}
						</label>
					</p>
					<Chart
						width={"90vw"}
						height={"75vh"}
						style={{
							margin: "0px auto",
							paddingTop: "25px",
							paddingBottom: "10vh",
						}}
						chartType="GeoChart"
						data={completeData(items)}
						rootProps={{ "data-testid": "1" }}
						options={{
							colorAxis: { colors: ["#FF5960", "#FF0000"] },
							region: "IN",
							domain: "IN",
							backgroundColor: "#161625",
							legend: "none",
							datalessRegionColor: "#161625",
							resolution: "provinces",
						}}
					/>
					<Chart
						style={{
							margin: "0px auto",
						}}
						chartType="Table"
						loader={<div>Loading Chart</div>}
						data={tableData(items)}
						options={{
							showRowNumber: true,
							height: "100%",
							width: "75vw",
							sortColumn: 1,
							sortAscending: false,
							allowHTML: true,
							cssClassNames: {
								headerRow: "header-row",
								tableRow: "table-row",
								headerCell: "header-cell",
								tableCell: "table-cell",
							},
						}}
					/>
				</div>
			);
		}
	}
}

class About extends React.Component {
	render() {
		return (
			<div className="about">
				<NavigationBar />
				<p>
					<img src={corona} align="right" alt="Corona Img" />
					Coronaviruses are a large family of viruses, including some
					that cause the common cold to some that cause major diseases
					such as the Severe Acute Respiratory Syndrome (SARS) and the
					Middle East Respiratory Syndrome (MERS).
					<br /> <br />
					The coronavirus (COVID-19) outbreak came to light when on
					December 31, 2019, China informed the World Health
					Organization (WHO) of a cluster of cases of pneumonia of an
					unknown cause in Wuhan City in Hubei province. On January 9,
					2020, the WHO issued a statement saying Chinese researchers
					have made “preliminary determination” of the virus as a
					novel coronavirus.
					<br /> <br />
					Since then, more than 3,000 deaths have been reported due to
					COVID-19 across the world. Cases have been reported from
					more than 80 countries, including India. The virus has
					acquired the ability to spread among humans, with cases of
					human-to-human transmissions being reported first in Vietnam
					and Germany.
					<br /> <br />
					With the overall cases worldwide rising rapidly, the WHO has
					declared the outbreak a global health emergency.
					<br /> <br />
					COVID-19 symptoms can include fever, cough and shortness of
					breath. The illness also causes lung lesions and pneumonia.
					Milder cases may resemble the flu or a bad cold, making
					detection difficult. Chinese researchers have shared the
					whole genome sequence of COVID-19, however apart from some
					basic details, not much is known about the virus in terms of
					its source, precise duration of incubation, severity, and
					what makes it quite easily transmissible.
					<br /> <br />
				</p>
			</div>
		);
	}
}

ReactDOM.render(
	<React.StrictMode>
		<National />
	</React.StrictMode>,
	document.getElementById("root")
);
