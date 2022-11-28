import "./SearchPosts.css";
import { useState, useEffect } from "react";
import Masonry from "react-masonry-css";

export function SearchPosts() {
	const [search, setSearch] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [showAll, setShowAll] = useState(false);
	const queryParams = showAll ? "&nsfw=1&include_over_18=on" : "";

	const handleQueryParams = () => {
		setShowAll(!showAll);
	};

	const handleSearch = (event) => {
		setSearch(event.target.value);
	};

	useEffect(() => {
		fetch(`https://www.reddit.com/search.json?q=${search}${queryParams}`)
			.then((response) => response.json())
			.then((json) => setSearchResults(json));
	}, [search, queryParams]);

	const displayResults = (searchResults) => {
		if (searchResults.length === 0) {
			return;
		}

		const titles = [];
		const images = [];
		const urls = [];
		const domain = "https://www.reddit.com";
		const data = searchResults.data.children;

		for (let i = 0; i < data.length; i++) {
			titles[i] = data[i].data.title;

			if (data[i].data.preview) {
				images[i] = data[i].data.preview.images[0].source.url.replace(/&amp;/g, "&");
			} else {
				images[i] = "https://www.redditstatic.com/icon.png";
			}

			urls[i] = domain + data[i].data.permalink;
		}

		return titles.map((title, index) => {
			return (
				<div key={index}>
					<a href={urls[index]} target="_blank" rel="noreferrer">
						<img src={images[index]} alt={title} loading="lazy" />
						{title}
					</a>
				</div>
			);
		});
	};

	const breakpointColumnsObj = {
		default: 4,
		1100: 3,
		700: 2,
		450: 1,
	};

	return (
		<div className="App">
			<header className="App-header">
				<input type="text" placeholder="Search" value={search} onChange={handleSearch} />
			</header>
			<main>
				<Masonry breakpointCols={breakpointColumnsObj} className="my-masonry-grid" columnClassName="my-masonry-grid_column">
					{displayResults(searchResults) || <div>No results</div>}
				</Masonry>
			</main>
			<div>
				<label htmlFor="showAll" className="showAll">
					Show all
				</label>
				<input type="checkbox" id="showAll" name="showAll" value={showAll} onChange={handleQueryParams} />
			</div>
		</div>
	);
}