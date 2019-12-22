// tslint:disable:no-var-requires

function importAll(r: any) {
    r.keys().forEach(r);
}

importAll((require as any).context('./', true, /\.spec\.(tsx|ts|jsx|js)$/));
