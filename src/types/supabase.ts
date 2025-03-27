export type GetServerTimeResponse = {
  timestamp: string;
};

export type ServerTimeResponse = {
  timestamp: string;
};

export type Database = {
  functions: {
    get_server_time: {
      args: Record<string, never>;
      returns: GetServerTimeResponse;
    };
  };
}; 