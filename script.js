document.addEventListener("DOMContentLoaded", () => {
	// dynamic copyright year
	const year = new Date().getFullYear();
	const date = document.getElementById("date");
	if (date) {
		date.textContent = year;
	}

	// mobile nav
	const body = document.querySelector("body");
	const buttons = document.querySelectorAll(".menu_button");
	const open = document.querySelector(".menu_open");

	buttons.forEach((button) => {
		button.addEventListener("click", () => {
			const isActive = body.classList.toggle("menu_active");
			if (isActive) {
				open.setAttribute("aria-expanded", "true");
			} else {
				open.setAttribute("aria-expanded", "false");
			}
		});
	});

	// close by hitting esc
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape" && body.classList.contains("menu_active")) {
			body.classList.remove("menu_active");
			open.setAttribute("aria-expanded", "false");
		}
	});

	// category filter
	const filterButtons = document.querySelector(".filter_buttons");
	const filterBtn = filterButtons.querySelectorAll("button");
	const products = document.querySelectorAll(".product");

	// Load More functionality variables
	const loadMoreBtn = document.querySelector(".load_more");

	let productsPerPage = 6;
	let currentCount = productsPerPage;
	let currentCategory = "all";

	function getFilteredProducts(category) {
		if (category === "all") {
			return Array.from(products);
		}
		return Array.from(products).filter((product) => product.getAttribute("data-category") === category);
	}

	function showProducts(count, category) {
		const filteredProducts = getFilteredProducts(category);
		Array.from(products).forEach((product) => {
			product.style.display = "none";
		});
		filteredProducts.forEach((product, idx) => {
			if (idx < count) {
				product.style.display = "";
			}
		});
		// Update all .filter_showing elements
		document.querySelectorAll(".filter_showing").forEach((showing) => {
			const first = showing.querySelector(".first_item");
			const last = showing.querySelector(".last_item");
			const total = showing.querySelector(".total_items");
			if (first) first.textContent = filteredProducts.length > 0 ? "1" : "0";
			if (last) last.textContent = Math.min(count, filteredProducts.length).toString();
			if (total) total.textContent = filteredProducts.length.toString();
		});
		if (loadMoreBtn) {
			if (count >= filteredProducts.length) {
				loadMoreBtn.style.display = "none";
			} else {
				loadMoreBtn.style.display = "";
			}
		}
	}

	showProducts(currentCount, currentCategory);

	if (loadMoreBtn) {
		loadMoreBtn.addEventListener("click", () => {
			const filteredProducts = getFilteredProducts(currentCategory);
			const prevCount = currentCount;
			currentCount += 3;
			showProducts(currentCount, currentCategory);
			// Move focus to first newly revealed product
			const newlyVisible = filteredProducts.slice(prevCount, currentCount).filter((product, idx) => idx === 0);
			if (newlyVisible.length && newlyVisible[0]) {
				newlyVisible[0].focus && newlyVisible[0].focus();
				// If not focusable, add tabindex and focus
				if (!newlyVisible[0].hasAttribute("tabindex")) {
					newlyVisible[0].setAttribute("tabindex", "-1");
				}
				newlyVisible[0].focus();
			}
		});
	}

	filterBtn.forEach((btn) => {
		btn.addEventListener("click", () => {
			const category = btn.getAttribute("data-category");
			// remove from all buttons
			filterBtn.forEach((button) => {
				button.classList.remove("active");
				button.setAttribute("aria-pressed", "false");
			});
			// add to the button pressed
			btn.classList.add("active");
			btn.setAttribute("aria-pressed", "true");

			// update current category and reset count
			currentCategory = category;
			currentCount = productsPerPage;
			showProducts(currentCount, currentCategory);
		});
	});
});
