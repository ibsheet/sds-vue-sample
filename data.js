module.exports = {
	info: {
		data: [],
		loadData: count => {
			const data = [];
			for (let i = 1; i <= count; i++) {
				data.push({
					L1: 'A' + i,
					L2: 'B' + i,
					L3: '홍길동',
					L5: '버튼',
					L9: 0,
					L10: 0,
					M3: '2022-01-11 9:45:00',
					R1: 'data',
					R2: 'data'
				});
			}
			return data;
		}
	}
}