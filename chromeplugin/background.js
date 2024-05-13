

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


chrome.contextMenus.onClicked.addListener(function (info, tab) {
	switch (info.menuItemId) {
		case 'saysnap-theme-mark':
		case 'saysnap-theme-blue':
		case 'saysnap-theme-default':
      const { selectionText } = info
			console.log('selectionText---', selectionText)
			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        // 向content.js发送消息
        chrome.tabs.sendMessage(tabs[0].id, { action: info.menuItemId, data: selectionText }, function (response) {
            console.log(response?.result);
        });
   		 });
			break;
		default:
			console.log('---')
	}
});

