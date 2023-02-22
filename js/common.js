document.addEventListener("DOMContentLoaded", function(){
	initialMenu();
});

window.onload = function() {
	completeLoading();
}

function getContextPath()
{
	var contextPath = sessionStorage.getItem("contextpath");
	return contextPath == null ? "" : contextPath;
};

function getControllerPath()
{
	var hostIndex = location.href.indexOf( location.host ) + location.host.length;
	var fullPath = location.href.substring( hostIndex );
	return fullPath.substring( getContextPath().length );
};

function completeLoading()
{	
	if(document.getElementById("loading") != null)
	{
		setTimeout(() => {
			document.getElementById("loading").remove();
			document.getElementById("layout-main").classList.remove("loading");
		}, 300);
	}
}

function initialMenu()
{
	var controllerPath = getControllerPath();
	var menuDepth1 = document.querySelectorAll("li.menu-depth-1 > div.menu");
	
	if(controllerPath.indexOf("mypage") >= 0)
	{
		document.getElementById("navParentName").innerText = "마이페이지";
		document.getElementById("navChildName").innerText = "상세정보";
		return;
	}
	
	for(let i = 0 ; i < menuDepth1.length ; i++)
	{
		let pattern = menuDepth1[i].dataset.menuPattern;
		if(controllerPath.indexOf(pattern) >= 0)
		{
			let menuName = menuDepth1[i].dataset.menuName;
			
			let menuChildWrap = menuDepth1[i].closest("li.menu-depth-1").querySelector("ul");
			menuDepth1[i].classList.add("menu-on");
			menuChildWrap.classList.add("menu-child-on");
			
			let childMenuList = menuChildWrap.querySelectorAll("li.menu-depth-2 > div.menu");
			for(let j = 0 ; j < childMenuList.length; j++)
			{
				let childPattern = childMenuList[j].dataset.menuPattern;
				if(controllerPath.indexOf(childPattern) >= 0)
				{
					let menuChildName = childMenuList[j].dataset.menuName;
					
					childMenuList[j].classList.add("menu-on");
					initialNav(menuName, menuChildName);
					return;
				}
			}
		}
	}
}

function initialNav(menuName, menuChildName)
{
	var navigation = document.getElementById("navigation");
	if(navigation != null)
	{
		document.getElementById("navParentName").innerText = menuName;
		document.getElementById("navChildName").innerText = menuChildName;
		
		var controllerPath = getControllerPath();
		if(controllerPath.indexOf("Create.do") >= 0 || controllerPath.indexOf("Detail.do") >= 0)
		{
			navigation.querySelector("div.child > img").style.display = "initial";
			navigation.querySelector("div.mode").style.display = "flex";
			
			document.getElementById("navModeName").innerText = (controllerPath.indexOf("Create.do") >= 0 ? "신규 등록" : "상세 정보");
		}
	}
}

function clickMenuDepth1(ele)
{
	let menuName = ele.children[0];
	let childMenu = ele.children[1];
	let isOpen = (menuName.className.indexOf("menu-on") >=0 ? true : false);
	
	if(isOpen)
	{
		menuName.classList.remove("menu-on");
		childMenu.classList.remove("menu-child-on");
	}
	else
	{
		menuName.classList.add("menu-on");
		childMenu.classList.add("menu-child-on");
	}
}

function clickMenuDepth2(url)
{
	event.stopPropagation();
	location.href = getContextPath() + url;
}

function fileDownload(fileNo)
{
	window.open(getContextPath() + "/file/download.do?fileNo=" + fileNo);
}

function baehabInfoKr(baehabGroupNo)
{
	location.href= getContextPath() + '/project/selectBaehabInfoKr.do?baehabGroupNo=' + baehabGroupNo;
}

function baehabInfoEn(baehabGroupNo)
{
	location.href= getContextPath() + '/project/formulaKrDetail.do?baehabGroupNo=' + baehabGroupNo;
}

function cosmeticInfo(cosmeticNo)
{
	location.href= getContextPath() + '/product/cosmeticDetail.do?cosmeticNo=' + cosmeticNo;
}