var Carousel = (function($) {

	var container = $("#info-carousel"),
		currentIndex = 0,
		loader,
		xmlData,
		imagesContainer,
		contentContainer,
		linksContainer,
		linksNum,
		timer;

	function addLoader() {
		loader = $("<div/>", { "class" : "ajax-loader" });

		loader
			.appendTo(container)
			.fadeIn("slow");
	}

	function makeRequest() {
		$.ajax({
			url : "carousel.xml",
			dataType : "xml"
		}).done(function(data) {
			xmlData = $(data);

			loader.fadeOut("slow", function() {
				loader.remove();
				buildCarousel();
			});
		});
	}

	function buildCarousel() {
		var image,
			contentItem,
			linksItem,
			linksItemHTML;

		imagesContainer = $("<div/>", { "class" : "image-container"});
		contentContainer = $("<div/>", { "class" : "content" });
		linksContainer = $("<ul/>", { "class" : "carousel-links" });

		container.append(imagesContainer, linksContainer);

		$.each(xmlData.find("info"), function(i, info) {
			info = $(info);

			image = $("<img/>", {
				src : "img/" + info.find("infoUrl").text().replace(".html", ".png"),
				alt  : ""
			});

			contentItem = $("<p/>", { text : info.find("infoDescription").text() });

			linksItem = $("<li/>");
			
			linksItemHTML = "<h3>" + info.find("infoTitle").text() + "</h3>" +
				"<span>" + info.find("infoLinkText").text() + "</span>";

			linksItem.html(linksItemHTML);

			contentItem.append($("<a/>", {
				href : info.find("infoUrl").text(),
				text : "далее"}
			));

			imagesContainer.append(image);
			contentContainer.append(contentItem);
			linksContainer.append(linksItem);
		});

		imagesContainer.append(contentContainer);

		container.append(imagesContainer);

		setActiveInfo(currentIndex);

		linksContainer.on("click", "li", onInfoClick);

		linksNum = linksContainer.find("li").length;

		timer = setInterval(cycleInfoAnimate, 5000);
	}

	function onInfoClick() {
		var $this = $(this);

		if($this.hasClass("active-info")) {
			return;
		}

		clearInterval(timer);
		timer = setInterval(cycleInfoAnimate, 5000);

		currentIndex = $this.index();

		animateInfo(currentIndex);
	}

	function setActiveInfo(index) {
		setActiveLink(index);
		setActiveContent(index);
	}

	function setActiveLink(index) {
		linksContainer
			.find(".active-info")
			.removeClass("active-info")
			.end()
			.find("li:eq(" + index + ")")
			.addClass("active-info");
	}

	function setActiveContent(index) {
		contentContainer
			.find("p")
			.not(":eq(" + index + ")")
			.hide();
	}

	function animateInfo(index) {
		setActiveLink(index);
		animateImages(index);
		animateContent(index);
	}

	function animateImages(index) {
		imagesContainer
			.find("img:visible")
			.fadeOut("fast", function() {
				imagesContainer
					.find("img:eq(" + index + ")")
					.fadeIn("fast");
			});
	}

	function animateContent(index) {
		contentContainer
			.find("p:visible")
			.fadeOut("fast", function() {
				contentContainer
					.find("p:eq(" + index + ")")
					.fadeIn("fast");
			});
	}

	function cycleInfoAnimate() {
		currentIndex++;

		if(currentIndex > linksNum - 1) {
			currentIndex = 0;
		}

		animateInfo(currentIndex);
	}

	function init() {
		addLoader();
		makeRequest();
	}

	return {
		init : init
	};

})(jQuery);

Carousel.init();