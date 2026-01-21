module.exports = {
    apps: [{
        name: 'curriculab-agent',
        script: './scripts/watcher.js',
        watch: false,
        autorestart: true,
        max_memory_restart: '200M',
        env: {
            NODE_ENV: 'production',
        },
    }],
};
