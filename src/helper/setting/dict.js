function createParentId(max) {
  const rnd = Math.min(parseInt(Math.random() * 10), max)
  return rnd || null
}

export function load(code) {
  const total = 10, options = []
  for (let i = 0; i < total; i++) {
    options.push({
      id: i + 1,
      parentId: createParentId(i),
      label: `选项${i + 1}`,
      value: i
    })
  }
  return Promise.resolve(options)
}
