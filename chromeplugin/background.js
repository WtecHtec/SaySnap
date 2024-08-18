

console.log('back groud js')


const parent = chrome.contextMenus.create({
	title: 'Shard-Card',
	id: 'saysnap',
	contexts: ['selection'],
});


chrome.contextMenus.create({  
  id: 'saysnap-theme-default',  
  title: 'SaySnap Theme Default',  
  parentId: 'saysnap', // 设置为顶级菜单项的ID来模拟父子关系  
  contexts: ['selection'],  
});  

chrome.contextMenus.create({  
  id:'saysnap-theme-blue',  
  title: 'SaySnap Theme Blue',
  parentId: 'saysnap', // 设置为顶级菜单项的ID来模拟父子关系  
  contexts: ['selection'],  
});


chrome.contextMenus.create({  
  id:'saysnap-theme-mark',  
  title: 'SaySnap Theme Mark',
  parentId: 'saysnap', // 设置为顶级菜单项的ID来模拟父子关系  
  contexts: ['selection'],  
});

chrome.contextMenus.create({  
  id:'retro-card',  
  title: 'Retro Card',
  parentId: 'saysnap', // 设置为顶级菜单项的ID来模拟父子关系  
  contexts: ['selection'],  
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
	const { selectionText } = info
	switch (info.menuItemId) {
		case 'saysnap-theme-mark':
		case 'saysnap-theme-blue':
		case 'saysnap-theme-default':
			console.log('selectionText---', selectionText)
			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        // 向content.js发送消息
        chrome.tabs.sendMessage(tabs[0].id, { action: info.menuItemId, data: selectionText }, function (response) {
            console.log(response?.result);
        });
   		 });
			break;
		case 'retro-card':
			
			chrome.tabs.create({ url: "https://retro.iwhy.dev/" }, (tab) => {
				console.log('selectionText--- retro-card', selectionText)
					chrome.scripting.executeScript({
						target: { tabId: tab.id },
						function: injectScript,
						args: [{
							author: '发现 ⋅ 分享',
							title: formatDateToChinese(new  Date()).join(' '),
							content: selectionText
						}]
					});
				});
			break
		default:
			console.log('---')
	}
});


function injectScript(info) {
	const { title, content, author } = info
	window.onload = () => {


	const titleDom = document.getElementById('title')
		titleDom.focus();
		titleDom.value = title;
		// 触发 input 事件，以确保任何绑定在 textarea 上的事件处理器被触发
		const event = new Event('input', { bubbles: true, cancelable: true });
		titleDom.dispatchEvent(event);

		const authorDom = document.getElementById('author')
		authorDom.focus();
		authorDom.value = author;
		// 触发 input 事件，以确保任何绑定在 textarea 上的事件处理器被触发
		authorDom.dispatchEvent(event);

		const contentDom = document.getElementById('content')
		contentDom.focus();
		contentDom.value = content;
		// 触发 input 事件，以确保任何绑定在 textarea 上的事件处理器被触发
		contentDom.dispatchEvent(event);


		const explanationDom = document.getElementById('explanation')
		explanationDom.focus();
		explanationDom.value = '';
		// 触发 input 事件，以确保任何绑定在 textarea 上的事件处理器被触发
		explanationDom.dispatchEvent(event);

	}

}


function formatDateToChinese(date) {  
	const chineseNumbers = ['零', '壹', '贰', '叁', '肆',  '伍', '陆',  '柒', '捌', '玖',];  
	const chineseMonths = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];  
	// 辅助函数：将数字转换为中文数字（仅处理个位和十位）  
	function toChineseNumber(str) {
		let res = ''
			for (let i = 0 ; i < str.length; i++) {
				res = `${res}${chineseNumbers[str[i]]}`
			}
			return res
	}

	// 格式化年份和月份  
	const year = date.getFullYear();  
	const yearStr = toChineseNumber(year.toString());
	const month = date.getMonth(); // 注意getMonth返回的是0-11，所以需要+1  
	const monthStr = chineseMonths[month];
	let strDate = date.getDate();
	if (strDate >= 0 && strDate <= 9) {
			strDate = "0" + strDate;
	}
	return [`${yearStr}年`, monthStr, strDate];  
} 