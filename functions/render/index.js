var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[Object.keys(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// node_modules/@sveltejs/kit/dist/install-fetch.js
function dataUriToBuffer(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  }
  uri = uri.replace(/\r?\n/g, "");
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }
  const meta = uri.substring(5, firstComma).split(";");
  let charset = "";
  let base64 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i = 1; i < meta.length; i++) {
    if (meta[i] === "base64") {
      base64 = true;
    } else {
      typeFull += `;${meta[i]}`;
      if (meta[i].indexOf("charset=") === 0) {
        charset = meta[i].substring(8);
      }
    }
  }
  if (!meta[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }
  const encoding = base64 ? "base64" : "ascii";
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding);
  buffer.type = type;
  buffer.typeFull = typeFull;
  buffer.charset = charset;
  return buffer;
}
async function* read(parts) {
  for (const part of parts) {
    if ("stream" in part) {
      yield* part.stream();
    } else {
      yield part;
    }
  }
}
function isFormData(object) {
  return typeof object === "object" && typeof object.append === "function" && typeof object.set === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.delete === "function" && typeof object.keys === "function" && typeof object.values === "function" && typeof object.entries === "function" && typeof object.constructor === "function" && object[NAME] === "FormData";
}
function getHeader(boundary, name, field) {
  let header = "";
  header += `${dashes}${boundary}${carriage}`;
  header += `Content-Disposition: form-data; name="${name}"`;
  if (isBlob(field)) {
    header += `; filename="${field.name}"${carriage}`;
    header += `Content-Type: ${field.type || "application/octet-stream"}`;
  }
  return `${header}${carriage.repeat(2)}`;
}
async function* formDataIterator(form, boundary) {
  for (const [name, value] of form) {
    yield getHeader(boundary, name, value);
    if (isBlob(value)) {
      yield* value.stream();
    } else {
      yield value;
    }
    yield carriage;
  }
  yield getFooter(boundary);
}
function getFormDataLength(form, boundary) {
  let length = 0;
  for (const [name, value] of form) {
    length += Buffer.byteLength(getHeader(boundary, name, value));
    if (isBlob(value)) {
      length += value.size;
    } else {
      length += Buffer.byteLength(String(value));
    }
    length += carriageLength;
  }
  length += Buffer.byteLength(getFooter(boundary));
  return length;
}
async function consumeBody(data) {
  if (data[INTERNALS$2].disturbed) {
    throw new TypeError(`body used already for: ${data.url}`);
  }
  data[INTERNALS$2].disturbed = true;
  if (data[INTERNALS$2].error) {
    throw data[INTERNALS$2].error;
  }
  let { body } = data;
  if (body === null) {
    return Buffer.alloc(0);
  }
  if (isBlob(body)) {
    body = body.stream();
  }
  if (Buffer.isBuffer(body)) {
    return body;
  }
  if (!(body instanceof import_stream.default)) {
    return Buffer.alloc(0);
  }
  const accum = [];
  let accumBytes = 0;
  try {
    for await (const chunk of body) {
      if (data.size > 0 && accumBytes + chunk.length > data.size) {
        const err = new FetchError(`content size at ${data.url} over limit: ${data.size}`, "max-size");
        body.destroy(err);
        throw err;
      }
      accumBytes += chunk.length;
      accum.push(chunk);
    }
  } catch (error3) {
    if (error3 instanceof FetchBaseError) {
      throw error3;
    } else {
      throw new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error3.message}`, "system", error3);
    }
  }
  if (body.readableEnded === true || body._readableState.ended === true) {
    try {
      if (accum.every((c) => typeof c === "string")) {
        return Buffer.from(accum.join(""));
      }
      return Buffer.concat(accum, accumBytes);
    } catch (error3) {
      throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error3.message}`, "system", error3);
    }
  } else {
    throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
  }
}
function fromRawHeaders(headers = []) {
  return new Headers(headers.reduce((result, value, index2, array) => {
    if (index2 % 2 === 0) {
      result.push(array.slice(index2, index2 + 2));
    }
    return result;
  }, []).filter(([name, value]) => {
    try {
      validateHeaderName(name);
      validateHeaderValue(name, String(value));
      return true;
    } catch {
      return false;
    }
  }));
}
async function fetch(url, options_) {
  return new Promise((resolve2, reject) => {
    const request = new Request(url, options_);
    const options2 = getNodeRequestOptions(request);
    if (!supportedSchemas.has(options2.protocol)) {
      throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${options2.protocol.replace(/:$/, "")}" is not supported.`);
    }
    if (options2.protocol === "data:") {
      const data = dataUriToBuffer$1(request.url);
      const response2 = new Response(data, { headers: { "Content-Type": data.typeFull } });
      resolve2(response2);
      return;
    }
    const send = (options2.protocol === "https:" ? import_https.default : import_http.default).request;
    const { signal } = request;
    let response = null;
    const abort = () => {
      const error3 = new AbortError("The operation was aborted.");
      reject(error3);
      if (request.body && request.body instanceof import_stream.default.Readable) {
        request.body.destroy(error3);
      }
      if (!response || !response.body) {
        return;
      }
      response.body.emit("error", error3);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = () => {
      abort();
      finalize();
    };
    const request_ = send(options2);
    if (signal) {
      signal.addEventListener("abort", abortAndFinalize);
    }
    const finalize = () => {
      request_.abort();
      if (signal) {
        signal.removeEventListener("abort", abortAndFinalize);
      }
    };
    request_.on("error", (err) => {
      reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, "system", err));
      finalize();
    });
    request_.on("response", (response_) => {
      request_.setTimeout(0);
      const headers = fromRawHeaders(response_.rawHeaders);
      if (isRedirect(response_.statusCode)) {
        const location = headers.get("Location");
        const locationURL = location === null ? null : new URL(location, request.url);
        switch (request.redirect) {
          case "error":
            reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
            finalize();
            return;
          case "manual":
            if (locationURL !== null) {
              try {
                headers.set("Location", locationURL);
              } catch (error3) {
                reject(error3);
              }
            }
            break;
          case "follow": {
            if (locationURL === null) {
              break;
            }
            if (request.counter >= request.follow) {
              reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
              finalize();
              return;
            }
            const requestOptions = {
              headers: new Headers(request.headers),
              follow: request.follow,
              counter: request.counter + 1,
              agent: request.agent,
              compress: request.compress,
              method: request.method,
              body: request.body,
              signal: request.signal,
              size: request.size
            };
            if (response_.statusCode !== 303 && request.body && options_.body instanceof import_stream.default.Readable) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request.method === "POST") {
              requestOptions.method = "GET";
              requestOptions.body = void 0;
              requestOptions.headers.delete("content-length");
            }
            resolve2(fetch(new Request(locationURL, requestOptions)));
            finalize();
            return;
          }
        }
      }
      response_.once("end", () => {
        if (signal) {
          signal.removeEventListener("abort", abortAndFinalize);
        }
      });
      let body = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error3) => {
        reject(error3);
      });
      if (process.version < "v12.10") {
        response_.on("aborted", abortAndFinalize);
      }
      const responseOptions = {
        url: request.url,
        status: response_.statusCode,
        statusText: response_.statusMessage,
        headers,
        size: request.size,
        counter: request.counter,
        highWaterMark: request.highWaterMark
      };
      const codings = headers.get("Content-Encoding");
      if (!request.compress || request.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      const zlibOptions = {
        flush: import_zlib.default.Z_SYNC_FLUSH,
        finishFlush: import_zlib.default.Z_SYNC_FLUSH
      };
      if (codings === "gzip" || codings === "x-gzip") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createGunzip(zlibOptions), (error3) => {
          reject(error3);
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      if (codings === "deflate" || codings === "x-deflate") {
        const raw = (0, import_stream.pipeline)(response_, new import_stream.PassThrough(), (error3) => {
          reject(error3);
        });
        raw.once("data", (chunk) => {
          if ((chunk[0] & 15) === 8) {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflate(), (error3) => {
              reject(error3);
            });
          } else {
            body = (0, import_stream.pipeline)(body, import_zlib.default.createInflateRaw(), (error3) => {
              reject(error3);
            });
          }
          response = new Response(body, responseOptions);
          resolve2(response);
        });
        return;
      }
      if (codings === "br") {
        body = (0, import_stream.pipeline)(body, import_zlib.default.createBrotliDecompress(), (error3) => {
          reject(error3);
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      response = new Response(body, responseOptions);
      resolve2(response);
    });
    writeToStream(request_, request);
  });
}
var import_http, import_https, import_zlib, import_stream, import_util, import_crypto, import_url, src, dataUriToBuffer$1, Readable, wm, Blob, fetchBlob, Blob$1, FetchBaseError, FetchError, NAME, isURLSearchParameters, isBlob, isAbortSignal, carriage, dashes, carriageLength, getFooter, getBoundary, INTERNALS$2, Body, clone, extractContentType, getTotalBytes, writeToStream, validateHeaderName, validateHeaderValue, Headers, redirectStatus, isRedirect, INTERNALS$1, Response, getSearch, INTERNALS, isRequest, Request, getNodeRequestOptions, AbortError, supportedSchemas;
var init_install_fetch = __esm({
  "node_modules/@sveltejs/kit/dist/install-fetch.js"() {
    init_shims();
    import_http = __toModule(require("http"));
    import_https = __toModule(require("https"));
    import_zlib = __toModule(require("zlib"));
    import_stream = __toModule(require("stream"));
    import_util = __toModule(require("util"));
    import_crypto = __toModule(require("crypto"));
    import_url = __toModule(require("url"));
    src = dataUriToBuffer;
    dataUriToBuffer$1 = src;
    ({ Readable } = import_stream.default);
    wm = new WeakMap();
    Blob = class {
      constructor(blobParts = [], options2 = {}) {
        let size2 = 0;
        const parts = blobParts.map((element) => {
          let buffer;
          if (element instanceof Buffer) {
            buffer = element;
          } else if (ArrayBuffer.isView(element)) {
            buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
          } else if (element instanceof ArrayBuffer) {
            buffer = Buffer.from(element);
          } else if (element instanceof Blob) {
            buffer = element;
          } else {
            buffer = Buffer.from(typeof element === "string" ? element : String(element));
          }
          size2 += buffer.length || buffer.size || 0;
          return buffer;
        });
        const type = options2.type === void 0 ? "" : String(options2.type).toLowerCase();
        wm.set(this, {
          type: /[^\u0020-\u007E]/.test(type) ? "" : type,
          size: size2,
          parts
        });
      }
      get size() {
        return wm.get(this).size;
      }
      get type() {
        return wm.get(this).type;
      }
      async text() {
        return Buffer.from(await this.arrayBuffer()).toString();
      }
      async arrayBuffer() {
        const data = new Uint8Array(this.size);
        let offset = 0;
        for await (const chunk of this.stream()) {
          data.set(chunk, offset);
          offset += chunk.length;
        }
        return data.buffer;
      }
      stream() {
        return Readable.from(read(wm.get(this).parts));
      }
      slice(start = 0, end = this.size, type = "") {
        const { size: size2 } = this;
        let relativeStart = start < 0 ? Math.max(size2 + start, 0) : Math.min(start, size2);
        let relativeEnd = end < 0 ? Math.max(size2 + end, 0) : Math.min(end, size2);
        const span = Math.max(relativeEnd - relativeStart, 0);
        const parts = wm.get(this).parts.values();
        const blobParts = [];
        let added = 0;
        for (const part of parts) {
          const size3 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
          if (relativeStart && size3 <= relativeStart) {
            relativeStart -= size3;
            relativeEnd -= size3;
          } else {
            const chunk = part.slice(relativeStart, Math.min(size3, relativeEnd));
            blobParts.push(chunk);
            added += ArrayBuffer.isView(chunk) ? chunk.byteLength : chunk.size;
            relativeStart = 0;
            if (added >= span) {
              break;
            }
          }
        }
        const blob = new Blob([], { type: String(type).toLowerCase() });
        Object.assign(wm.get(blob), { size: span, parts: blobParts });
        return blob;
      }
      get [Symbol.toStringTag]() {
        return "Blob";
      }
      static [Symbol.hasInstance](object) {
        return object && typeof object === "object" && typeof object.stream === "function" && object.stream.length === 0 && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
      }
    };
    Object.defineProperties(Blob.prototype, {
      size: { enumerable: true },
      type: { enumerable: true },
      slice: { enumerable: true }
    });
    fetchBlob = Blob;
    Blob$1 = fetchBlob;
    FetchBaseError = class extends Error {
      constructor(message, type) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.type = type;
      }
      get name() {
        return this.constructor.name;
      }
      get [Symbol.toStringTag]() {
        return this.constructor.name;
      }
    };
    FetchError = class extends FetchBaseError {
      constructor(message, type, systemError) {
        super(message, type);
        if (systemError) {
          this.code = this.errno = systemError.code;
          this.erroredSysCall = systemError.syscall;
        }
      }
    };
    NAME = Symbol.toStringTag;
    isURLSearchParameters = (object) => {
      return typeof object === "object" && typeof object.append === "function" && typeof object.delete === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.has === "function" && typeof object.set === "function" && typeof object.sort === "function" && object[NAME] === "URLSearchParams";
    };
    isBlob = (object) => {
      return typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
    };
    isAbortSignal = (object) => {
      return typeof object === "object" && object[NAME] === "AbortSignal";
    };
    carriage = "\r\n";
    dashes = "-".repeat(2);
    carriageLength = Buffer.byteLength(carriage);
    getFooter = (boundary) => `${dashes}${boundary}${dashes}${carriage.repeat(2)}`;
    getBoundary = () => (0, import_crypto.randomBytes)(8).toString("hex");
    INTERNALS$2 = Symbol("Body internals");
    Body = class {
      constructor(body, {
        size: size2 = 0
      } = {}) {
        let boundary = null;
        if (body === null) {
          body = null;
        } else if (isURLSearchParameters(body)) {
          body = Buffer.from(body.toString());
        } else if (isBlob(body))
          ;
        else if (Buffer.isBuffer(body))
          ;
        else if (import_util.types.isAnyArrayBuffer(body)) {
          body = Buffer.from(body);
        } else if (ArrayBuffer.isView(body)) {
          body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
        } else if (body instanceof import_stream.default)
          ;
        else if (isFormData(body)) {
          boundary = `NodeFetchFormDataBoundary${getBoundary()}`;
          body = import_stream.default.Readable.from(formDataIterator(body, boundary));
        } else {
          body = Buffer.from(String(body));
        }
        this[INTERNALS$2] = {
          body,
          boundary,
          disturbed: false,
          error: null
        };
        this.size = size2;
        if (body instanceof import_stream.default) {
          body.on("error", (err) => {
            const error3 = err instanceof FetchBaseError ? err : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${err.message}`, "system", err);
            this[INTERNALS$2].error = error3;
          });
        }
      }
      get body() {
        return this[INTERNALS$2].body;
      }
      get bodyUsed() {
        return this[INTERNALS$2].disturbed;
      }
      async arrayBuffer() {
        const { buffer, byteOffset, byteLength } = await consumeBody(this);
        return buffer.slice(byteOffset, byteOffset + byteLength);
      }
      async blob() {
        const ct = this.headers && this.headers.get("content-type") || this[INTERNALS$2].body && this[INTERNALS$2].body.type || "";
        const buf = await this.buffer();
        return new Blob$1([buf], {
          type: ct
        });
      }
      async json() {
        const buffer = await consumeBody(this);
        return JSON.parse(buffer.toString());
      }
      async text() {
        const buffer = await consumeBody(this);
        return buffer.toString();
      }
      buffer() {
        return consumeBody(this);
      }
    };
    Object.defineProperties(Body.prototype, {
      body: { enumerable: true },
      bodyUsed: { enumerable: true },
      arrayBuffer: { enumerable: true },
      blob: { enumerable: true },
      json: { enumerable: true },
      text: { enumerable: true }
    });
    clone = (instance, highWaterMark) => {
      let p1;
      let p2;
      let { body } = instance;
      if (instance.bodyUsed) {
        throw new Error("cannot clone body after it is used");
      }
      if (body instanceof import_stream.default && typeof body.getBoundary !== "function") {
        p1 = new import_stream.PassThrough({ highWaterMark });
        p2 = new import_stream.PassThrough({ highWaterMark });
        body.pipe(p1);
        body.pipe(p2);
        instance[INTERNALS$2].body = p1;
        body = p2;
      }
      return body;
    };
    extractContentType = (body, request) => {
      if (body === null) {
        return null;
      }
      if (typeof body === "string") {
        return "text/plain;charset=UTF-8";
      }
      if (isURLSearchParameters(body)) {
        return "application/x-www-form-urlencoded;charset=UTF-8";
      }
      if (isBlob(body)) {
        return body.type || null;
      }
      if (Buffer.isBuffer(body) || import_util.types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
        return null;
      }
      if (body && typeof body.getBoundary === "function") {
        return `multipart/form-data;boundary=${body.getBoundary()}`;
      }
      if (isFormData(body)) {
        return `multipart/form-data; boundary=${request[INTERNALS$2].boundary}`;
      }
      if (body instanceof import_stream.default) {
        return null;
      }
      return "text/plain;charset=UTF-8";
    };
    getTotalBytes = (request) => {
      const { body } = request;
      if (body === null) {
        return 0;
      }
      if (isBlob(body)) {
        return body.size;
      }
      if (Buffer.isBuffer(body)) {
        return body.length;
      }
      if (body && typeof body.getLengthSync === "function") {
        return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
      }
      if (isFormData(body)) {
        return getFormDataLength(request[INTERNALS$2].boundary);
      }
      return null;
    };
    writeToStream = (dest, { body }) => {
      if (body === null) {
        dest.end();
      } else if (isBlob(body)) {
        body.stream().pipe(dest);
      } else if (Buffer.isBuffer(body)) {
        dest.write(body);
        dest.end();
      } else {
        body.pipe(dest);
      }
    };
    validateHeaderName = typeof import_http.default.validateHeaderName === "function" ? import_http.default.validateHeaderName : (name) => {
      if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name)) {
        const err = new TypeError(`Header name must be a valid HTTP token [${name}]`);
        Object.defineProperty(err, "code", { value: "ERR_INVALID_HTTP_TOKEN" });
        throw err;
      }
    };
    validateHeaderValue = typeof import_http.default.validateHeaderValue === "function" ? import_http.default.validateHeaderValue : (name, value) => {
      if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value)) {
        const err = new TypeError(`Invalid character in header content ["${name}"]`);
        Object.defineProperty(err, "code", { value: "ERR_INVALID_CHAR" });
        throw err;
      }
    };
    Headers = class extends URLSearchParams {
      constructor(init2) {
        let result = [];
        if (init2 instanceof Headers) {
          const raw = init2.raw();
          for (const [name, values] of Object.entries(raw)) {
            result.push(...values.map((value) => [name, value]));
          }
        } else if (init2 == null)
          ;
        else if (typeof init2 === "object" && !import_util.types.isBoxedPrimitive(init2)) {
          const method = init2[Symbol.iterator];
          if (method == null) {
            result.push(...Object.entries(init2));
          } else {
            if (typeof method !== "function") {
              throw new TypeError("Header pairs must be iterable");
            }
            result = [...init2].map((pair) => {
              if (typeof pair !== "object" || import_util.types.isBoxedPrimitive(pair)) {
                throw new TypeError("Each header pair must be an iterable object");
              }
              return [...pair];
            }).map((pair) => {
              if (pair.length !== 2) {
                throw new TypeError("Each header pair must be a name/value tuple");
              }
              return [...pair];
            });
          }
        } else {
          throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
        }
        result = result.length > 0 ? result.map(([name, value]) => {
          validateHeaderName(name);
          validateHeaderValue(name, String(value));
          return [String(name).toLowerCase(), String(value)];
        }) : void 0;
        super(result);
        return new Proxy(this, {
          get(target, p, receiver) {
            switch (p) {
              case "append":
              case "set":
                return (name, value) => {
                  validateHeaderName(name);
                  validateHeaderValue(name, String(value));
                  return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase(), String(value));
                };
              case "delete":
              case "has":
              case "getAll":
                return (name) => {
                  validateHeaderName(name);
                  return URLSearchParams.prototype[p].call(receiver, String(name).toLowerCase());
                };
              case "keys":
                return () => {
                  target.sort();
                  return new Set(URLSearchParams.prototype.keys.call(target)).keys();
                };
              default:
                return Reflect.get(target, p, receiver);
            }
          }
        });
      }
      get [Symbol.toStringTag]() {
        return this.constructor.name;
      }
      toString() {
        return Object.prototype.toString.call(this);
      }
      get(name) {
        const values = this.getAll(name);
        if (values.length === 0) {
          return null;
        }
        let value = values.join(", ");
        if (/^content-encoding$/i.test(name)) {
          value = value.toLowerCase();
        }
        return value;
      }
      forEach(callback) {
        for (const name of this.keys()) {
          callback(this.get(name), name);
        }
      }
      *values() {
        for (const name of this.keys()) {
          yield this.get(name);
        }
      }
      *entries() {
        for (const name of this.keys()) {
          yield [name, this.get(name)];
        }
      }
      [Symbol.iterator]() {
        return this.entries();
      }
      raw() {
        return [...this.keys()].reduce((result, key) => {
          result[key] = this.getAll(key);
          return result;
        }, {});
      }
      [Symbol.for("nodejs.util.inspect.custom")]() {
        return [...this.keys()].reduce((result, key) => {
          const values = this.getAll(key);
          if (key === "host") {
            result[key] = values[0];
          } else {
            result[key] = values.length > 1 ? values : values[0];
          }
          return result;
        }, {});
      }
    };
    Object.defineProperties(Headers.prototype, ["get", "entries", "forEach", "values"].reduce((result, property) => {
      result[property] = { enumerable: true };
      return result;
    }, {}));
    redirectStatus = new Set([301, 302, 303, 307, 308]);
    isRedirect = (code) => {
      return redirectStatus.has(code);
    };
    INTERNALS$1 = Symbol("Response internals");
    Response = class extends Body {
      constructor(body = null, options2 = {}) {
        super(body, options2);
        const status = options2.status || 200;
        const headers = new Headers(options2.headers);
        if (body !== null && !headers.has("Content-Type")) {
          const contentType = extractContentType(body);
          if (contentType) {
            headers.append("Content-Type", contentType);
          }
        }
        this[INTERNALS$1] = {
          url: options2.url,
          status,
          statusText: options2.statusText || "",
          headers,
          counter: options2.counter,
          highWaterMark: options2.highWaterMark
        };
      }
      get url() {
        return this[INTERNALS$1].url || "";
      }
      get status() {
        return this[INTERNALS$1].status;
      }
      get ok() {
        return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
      }
      get redirected() {
        return this[INTERNALS$1].counter > 0;
      }
      get statusText() {
        return this[INTERNALS$1].statusText;
      }
      get headers() {
        return this[INTERNALS$1].headers;
      }
      get highWaterMark() {
        return this[INTERNALS$1].highWaterMark;
      }
      clone() {
        return new Response(clone(this, this.highWaterMark), {
          url: this.url,
          status: this.status,
          statusText: this.statusText,
          headers: this.headers,
          ok: this.ok,
          redirected: this.redirected,
          size: this.size
        });
      }
      static redirect(url, status = 302) {
        if (!isRedirect(status)) {
          throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
        }
        return new Response(null, {
          headers: {
            location: new URL(url).toString()
          },
          status
        });
      }
      get [Symbol.toStringTag]() {
        return "Response";
      }
    };
    Object.defineProperties(Response.prototype, {
      url: { enumerable: true },
      status: { enumerable: true },
      ok: { enumerable: true },
      redirected: { enumerable: true },
      statusText: { enumerable: true },
      headers: { enumerable: true },
      clone: { enumerable: true }
    });
    getSearch = (parsedURL) => {
      if (parsedURL.search) {
        return parsedURL.search;
      }
      const lastOffset = parsedURL.href.length - 1;
      const hash2 = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
      return parsedURL.href[lastOffset - hash2.length] === "?" ? "?" : "";
    };
    INTERNALS = Symbol("Request internals");
    isRequest = (object) => {
      return typeof object === "object" && typeof object[INTERNALS] === "object";
    };
    Request = class extends Body {
      constructor(input, init2 = {}) {
        let parsedURL;
        if (isRequest(input)) {
          parsedURL = new URL(input.url);
        } else {
          parsedURL = new URL(input);
          input = {};
        }
        let method = init2.method || input.method || "GET";
        method = method.toUpperCase();
        if ((init2.body != null || isRequest(input)) && input.body !== null && (method === "GET" || method === "HEAD")) {
          throw new TypeError("Request with GET/HEAD method cannot have body");
        }
        const inputBody = init2.body ? init2.body : isRequest(input) && input.body !== null ? clone(input) : null;
        super(inputBody, {
          size: init2.size || input.size || 0
        });
        const headers = new Headers(init2.headers || input.headers || {});
        if (inputBody !== null && !headers.has("Content-Type")) {
          const contentType = extractContentType(inputBody, this);
          if (contentType) {
            headers.append("Content-Type", contentType);
          }
        }
        let signal = isRequest(input) ? input.signal : null;
        if ("signal" in init2) {
          signal = init2.signal;
        }
        if (signal !== null && !isAbortSignal(signal)) {
          throw new TypeError("Expected signal to be an instanceof AbortSignal");
        }
        this[INTERNALS] = {
          method,
          redirect: init2.redirect || input.redirect || "follow",
          headers,
          parsedURL,
          signal
        };
        this.follow = init2.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init2.follow;
        this.compress = init2.compress === void 0 ? input.compress === void 0 ? true : input.compress : init2.compress;
        this.counter = init2.counter || input.counter || 0;
        this.agent = init2.agent || input.agent;
        this.highWaterMark = init2.highWaterMark || input.highWaterMark || 16384;
        this.insecureHTTPParser = init2.insecureHTTPParser || input.insecureHTTPParser || false;
      }
      get method() {
        return this[INTERNALS].method;
      }
      get url() {
        return (0, import_url.format)(this[INTERNALS].parsedURL);
      }
      get headers() {
        return this[INTERNALS].headers;
      }
      get redirect() {
        return this[INTERNALS].redirect;
      }
      get signal() {
        return this[INTERNALS].signal;
      }
      clone() {
        return new Request(this);
      }
      get [Symbol.toStringTag]() {
        return "Request";
      }
    };
    Object.defineProperties(Request.prototype, {
      method: { enumerable: true },
      url: { enumerable: true },
      headers: { enumerable: true },
      redirect: { enumerable: true },
      clone: { enumerable: true },
      signal: { enumerable: true }
    });
    getNodeRequestOptions = (request) => {
      const { parsedURL } = request[INTERNALS];
      const headers = new Headers(request[INTERNALS].headers);
      if (!headers.has("Accept")) {
        headers.set("Accept", "*/*");
      }
      let contentLengthValue = null;
      if (request.body === null && /^(post|put)$/i.test(request.method)) {
        contentLengthValue = "0";
      }
      if (request.body !== null) {
        const totalBytes = getTotalBytes(request);
        if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
          contentLengthValue = String(totalBytes);
        }
      }
      if (contentLengthValue) {
        headers.set("Content-Length", contentLengthValue);
      }
      if (!headers.has("User-Agent")) {
        headers.set("User-Agent", "node-fetch");
      }
      if (request.compress && !headers.has("Accept-Encoding")) {
        headers.set("Accept-Encoding", "gzip,deflate,br");
      }
      let { agent } = request;
      if (typeof agent === "function") {
        agent = agent(parsedURL);
      }
      if (!headers.has("Connection") && !agent) {
        headers.set("Connection", "close");
      }
      const search = getSearch(parsedURL);
      const requestOptions = {
        path: parsedURL.pathname + search,
        pathname: parsedURL.pathname,
        hostname: parsedURL.hostname,
        protocol: parsedURL.protocol,
        port: parsedURL.port,
        hash: parsedURL.hash,
        search: parsedURL.search,
        query: parsedURL.query,
        href: parsedURL.href,
        method: request.method,
        headers: headers[Symbol.for("nodejs.util.inspect.custom")](),
        insecureHTTPParser: request.insecureHTTPParser,
        agent
      };
      return requestOptions;
    };
    AbortError = class extends FetchBaseError {
      constructor(message, type = "aborted") {
        super(message, type);
      }
    };
    supportedSchemas = new Set(["data:", "http:", "https:"]);
  }
});

// node_modules/@sveltejs/adapter-netlify/files/shims.js
var init_shims = __esm({
  "node_modules/@sveltejs/adapter-netlify/files/shims.js"() {
    init_install_fetch();
  }
});

// node_modules/cookie/index.js
var require_cookie = __commonJS({
  "node_modules/cookie/index.js"(exports) {
    init_shims();
    "use strict";
    exports.parse = parse;
    exports.serialize = serialize;
    var decode = decodeURIComponent;
    var encode = encodeURIComponent;
    var pairSplitRegExp = /; */;
    var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
    function parse(str, options2) {
      if (typeof str !== "string") {
        throw new TypeError("argument str must be a string");
      }
      var obj = {};
      var opt = options2 || {};
      var pairs = str.split(pairSplitRegExp);
      var dec = opt.decode || decode;
      for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i];
        var eq_idx = pair.indexOf("=");
        if (eq_idx < 0) {
          continue;
        }
        var key = pair.substr(0, eq_idx).trim();
        var val = pair.substr(++eq_idx, pair.length).trim();
        if (val[0] == '"') {
          val = val.slice(1, -1);
        }
        if (obj[key] == void 0) {
          obj[key] = tryDecode(val, dec);
        }
      }
      return obj;
    }
    function serialize(name, val, options2) {
      var opt = options2 || {};
      var enc = opt.encode || encode;
      if (typeof enc !== "function") {
        throw new TypeError("option encode is invalid");
      }
      if (!fieldContentRegExp.test(name)) {
        throw new TypeError("argument name is invalid");
      }
      var value = enc(val);
      if (value && !fieldContentRegExp.test(value)) {
        throw new TypeError("argument val is invalid");
      }
      var str = name + "=" + value;
      if (opt.maxAge != null) {
        var maxAge = opt.maxAge - 0;
        if (isNaN(maxAge) || !isFinite(maxAge)) {
          throw new TypeError("option maxAge is invalid");
        }
        str += "; Max-Age=" + Math.floor(maxAge);
      }
      if (opt.domain) {
        if (!fieldContentRegExp.test(opt.domain)) {
          throw new TypeError("option domain is invalid");
        }
        str += "; Domain=" + opt.domain;
      }
      if (opt.path) {
        if (!fieldContentRegExp.test(opt.path)) {
          throw new TypeError("option path is invalid");
        }
        str += "; Path=" + opt.path;
      }
      if (opt.expires) {
        if (typeof opt.expires.toUTCString !== "function") {
          throw new TypeError("option expires is invalid");
        }
        str += "; Expires=" + opt.expires.toUTCString();
      }
      if (opt.httpOnly) {
        str += "; HttpOnly";
      }
      if (opt.secure) {
        str += "; Secure";
      }
      if (opt.sameSite) {
        var sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
        switch (sameSite) {
          case true:
            str += "; SameSite=Strict";
            break;
          case "lax":
            str += "; SameSite=Lax";
            break;
          case "strict":
            str += "; SameSite=Strict";
            break;
          case "none":
            str += "; SameSite=None";
            break;
          default:
            throw new TypeError("option sameSite is invalid");
        }
      }
      return str;
    }
    function tryDecode(str, decode2) {
      try {
        return decode2(str);
      } catch (e) {
        return str;
      }
    }
  }
});

// .svelte-kit/netlify/entry.js
__export(exports, {
  handler: () => handler
});
init_shims();

// .svelte-kit/output/server/app.js
init_shims();

// node_modules/@sveltejs/kit/dist/ssr.js
init_shims();

// node_modules/@sveltejs/kit/dist/adapter-utils.js
init_shims();
function isContentTypeTextual(content_type) {
  if (!content_type)
    return true;
  const [type] = content_type.split(";");
  return type === "text/plain" || type === "application/json" || type === "application/x-www-form-urlencoded" || type === "multipart/form-data";
}

// node_modules/@sveltejs/kit/dist/ssr.js
function lowercase_keys(obj) {
  const clone2 = {};
  for (const key in obj) {
    clone2[key.toLowerCase()] = obj[key];
  }
  return clone2;
}
function error(body) {
  return {
    status: 500,
    body,
    headers: {}
  };
}
function is_string(s2) {
  return typeof s2 === "string" || s2 instanceof String;
}
async function render_endpoint(request, route) {
  const mod = await route.load();
  const handler2 = mod[request.method.toLowerCase().replace("delete", "del")];
  if (!handler2) {
    return;
  }
  const match = route.pattern.exec(request.path);
  if (!match) {
    return error("could not parse parameters from request path");
  }
  const params = route.params(match);
  const response = await handler2({ ...request, params });
  const preface = `Invalid response from route ${request.path}`;
  if (!response) {
    return;
  }
  if (typeof response !== "object") {
    return error(`${preface}: expected an object, got ${typeof response}`);
  }
  let { status = 200, body, headers = {} } = response;
  headers = lowercase_keys(headers);
  const type = headers["content-type"];
  const is_type_textual = isContentTypeTextual(type);
  if (!is_type_textual && !(body instanceof Uint8Array || is_string(body))) {
    return error(`${preface}: body must be an instance of string or Uint8Array if content-type is not a supported textual content-type`);
  }
  let normalized_body;
  if ((typeof body === "object" || typeof body === "undefined") && !(body instanceof Uint8Array) && (!type || type.startsWith("application/json"))) {
    headers = { ...headers, "content-type": "application/json; charset=utf-8" };
    normalized_body = JSON.stringify(typeof body === "undefined" ? {} : body);
  } else {
    normalized_body = body;
  }
  return { status, body: normalized_body, headers };
}
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped$1 = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
function devalue(value) {
  var counts = new Map();
  function walk(thing) {
    if (typeof thing === "function") {
      throw new Error("Cannot stringify a function");
    }
    if (counts.has(thing)) {
      counts.set(thing, counts.get(thing) + 1);
      return;
    }
    counts.set(thing, 1);
    if (!isPrimitive(thing)) {
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach(walk);
          break;
        case "Set":
        case "Map":
          Array.from(thing).forEach(walk);
          break;
        default:
          var proto = Object.getPrototypeOf(thing);
          if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
            throw new Error("Cannot stringify arbitrary non-POJOs");
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new Error("Cannot stringify POJOs with symbolic keys");
          }
          Object.keys(thing).forEach(function(key) {
            return walk(thing[key]);
          });
      }
    }
  }
  walk(value);
  var names = new Map();
  Array.from(counts).filter(function(entry) {
    return entry[1] > 1;
  }).sort(function(a, b) {
    return b[1] - a[1];
  }).forEach(function(entry, i) {
    names.set(entry[0], getName(i));
  });
  function stringify(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (isPrimitive(thing)) {
      return stringifyPrimitive(thing);
    }
    var type = getType(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return "Object(" + stringify(thing.valueOf()) + ")";
      case "RegExp":
        return "new RegExp(" + stringifyString(thing.source) + ', "' + thing.flags + '")';
      case "Date":
        return "new Date(" + thing.getTime() + ")";
      case "Array":
        var members = thing.map(function(v, i) {
          return i in thing ? stringify(v) : "";
        });
        var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return "[" + members.join(",") + tail + "]";
      case "Set":
      case "Map":
        return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
      default:
        var obj = "{" + Object.keys(thing).map(function(key) {
          return safeKey(key) + ":" + stringify(thing[key]);
        }).join(",") + "}";
        var proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return Object.keys(thing).length > 0 ? "Object.assign(Object.create(null)," + obj + ")" : "Object.create(null)";
        }
        return obj;
    }
  }
  var str = stringify(value);
  if (names.size) {
    var params_1 = [];
    var statements_1 = [];
    var values_1 = [];
    names.forEach(function(name, thing) {
      params_1.push(name);
      if (isPrimitive(thing)) {
        values_1.push(stringifyPrimitive(thing));
        return;
      }
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values_1.push("Object(" + stringify(thing.valueOf()) + ")");
          break;
        case "RegExp":
          values_1.push(thing.toString());
          break;
        case "Date":
          values_1.push("new Date(" + thing.getTime() + ")");
          break;
        case "Array":
          values_1.push("Array(" + thing.length + ")");
          thing.forEach(function(v, i) {
            statements_1.push(name + "[" + i + "]=" + stringify(v));
          });
          break;
        case "Set":
          values_1.push("new Set");
          statements_1.push(name + "." + Array.from(thing).map(function(v) {
            return "add(" + stringify(v) + ")";
          }).join("."));
          break;
        case "Map":
          values_1.push("new Map");
          statements_1.push(name + "." + Array.from(thing).map(function(_a) {
            var k = _a[0], v = _a[1];
            return "set(" + stringify(k) + ", " + stringify(v) + ")";
          }).join("."));
          break;
        default:
          values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
          Object.keys(thing).forEach(function(key) {
            statements_1.push("" + name + safeProp(key) + "=" + stringify(thing[key]));
          });
      }
    });
    statements_1.push("return " + str);
    return "(function(" + params_1.join(",") + "){" + statements_1.join(";") + "}(" + values_1.join(",") + "))";
  } else {
    return str;
  }
}
function getName(num) {
  var name = "";
  do {
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? name + "_" : name;
}
function isPrimitive(thing) {
  return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
  if (typeof thing === "string")
    return stringifyString(thing);
  if (thing === void 0)
    return "void 0";
  if (thing === 0 && 1 / thing < 0)
    return "-0";
  var str = String(thing);
  if (typeof thing === "number")
    return str.replace(/^(-)?0\./, "$1.");
  return str;
}
function getType(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
  return escaped$1[c] || c;
}
function escapeUnsafeChars(str) {
  return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
}
function safeProp(key) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
}
function stringifyString(str) {
  var result = '"';
  for (var i = 0; i < str.length; i += 1) {
    var char = str.charAt(i);
    var code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped$1) {
      result += escaped$1[char];
    } else if (code >= 55296 && code <= 57343) {
      var next = str.charCodeAt(i + 1);
      if (code <= 56319 && (next >= 56320 && next <= 57343)) {
        result += char + str[++i];
      } else {
        result += "\\u" + code.toString(16).toUpperCase();
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
function noop() {
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
Promise.resolve();
var subscriber_queue = [];
function writable(value, start = noop) {
  let stop;
  const subscribers = [];
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (let i = 0; i < subscribers.length; i += 1) {
          const s2 = subscribers[i];
          s2[1]();
          subscriber_queue.push(s2, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.push(subscriber);
    if (subscribers.length === 1) {
      stop = start(set) || noop;
    }
    run2(value);
    return () => {
      const index2 = subscribers.indexOf(subscriber);
      if (index2 !== -1) {
        subscribers.splice(index2, 1);
      }
      if (subscribers.length === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
function hash(value) {
  let hash2 = 5381;
  let i = value.length;
  if (typeof value === "string") {
    while (i)
      hash2 = hash2 * 33 ^ value.charCodeAt(--i);
  } else {
    while (i)
      hash2 = hash2 * 33 ^ value[--i];
  }
  return (hash2 >>> 0).toString(36);
}
var s$1 = JSON.stringify;
async function render_response({
  options: options2,
  $session,
  page_config,
  status,
  error: error3,
  branch,
  page: page2
}) {
  const css2 = new Set(options2.entry.css);
  const js = new Set(options2.entry.js);
  const styles = new Set();
  const serialized_data = [];
  let rendered;
  let is_private = false;
  let maxage;
  if (error3) {
    error3.stack = options2.get_stack(error3);
  }
  if (branch) {
    branch.forEach(({ node, loaded, fetched, uses_credentials }) => {
      if (node.css)
        node.css.forEach((url) => css2.add(url));
      if (node.js)
        node.js.forEach((url) => js.add(url));
      if (node.styles)
        node.styles.forEach((content) => styles.add(content));
      if (fetched && page_config.hydrate)
        serialized_data.push(...fetched);
      if (uses_credentials)
        is_private = true;
      maxage = loaded.maxage;
    });
    const session = writable($session);
    const props = {
      stores: {
        page: writable(null),
        navigating: writable(null),
        session
      },
      page: page2,
      components: branch.map(({ node }) => node.module.default)
    };
    for (let i = 0; i < branch.length; i += 1) {
      props[`props_${i}`] = await branch[i].loaded.props;
    }
    let session_tracking_active = false;
    const unsubscribe = session.subscribe(() => {
      if (session_tracking_active)
        is_private = true;
    });
    session_tracking_active = true;
    try {
      rendered = options2.root.render(props);
    } finally {
      unsubscribe();
    }
  } else {
    rendered = { head: "", html: "", css: { code: "", map: null } };
  }
  const include_js = page_config.router || page_config.hydrate;
  if (!include_js)
    js.clear();
  const links = options2.amp ? styles.size > 0 || rendered.css.code.length > 0 ? `<style amp-custom>${Array.from(styles).concat(rendered.css.code).join("\n")}</style>` : "" : [
    ...Array.from(js).map((dep) => `<link rel="modulepreload" href="${dep}">`),
    ...Array.from(css2).map((dep) => `<link rel="stylesheet" href="${dep}">`)
  ].join("\n		");
  let init2 = "";
  if (options2.amp) {
    init2 = `
		<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
		<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
		<script async src="https://cdn.ampproject.org/v0.js"><\/script>`;
  } else if (include_js) {
    init2 = `<script type="module">
			import { start } from ${s$1(options2.entry.file)};
			start({
				target: ${options2.target ? `document.querySelector(${s$1(options2.target)})` : "document.body"},
				paths: ${s$1(options2.paths)},
				session: ${try_serialize($session, (error4) => {
      throw new Error(`Failed to serialize session data: ${error4.message}`);
    })},
				host: ${page2 && page2.host ? s$1(page2.host) : "location.host"},
				route: ${!!page_config.router},
				spa: ${!page_config.ssr},
				trailing_slash: ${s$1(options2.trailing_slash)},
				hydrate: ${page_config.ssr && page_config.hydrate ? `{
					status: ${status},
					error: ${serialize_error(error3)},
					nodes: [
						${(branch || []).map(({ node }) => `import(${s$1(node.entry)})`).join(",\n						")}
					],
					page: {
						host: ${page2 && page2.host ? s$1(page2.host) : "location.host"}, // TODO this is redundant
						path: ${s$1(page2 && page2.path)},
						query: new URLSearchParams(${page2 ? s$1(page2.query.toString()) : ""}),
						params: ${page2 && s$1(page2.params)}
					}
				}` : "null"}
			});
		<\/script>`;
  }
  if (options2.service_worker) {
    init2 += `<script>
			if ('serviceWorker' in navigator) {
				navigator.serviceWorker.register('${options2.service_worker}');
			}
		<\/script>`;
  }
  const head = [
    rendered.head,
    styles.size && !options2.amp ? `<style data-svelte>${Array.from(styles).join("\n")}</style>` : "",
    links,
    init2
  ].join("\n\n		");
  const body = options2.amp ? rendered.html : `${rendered.html}

			${serialized_data.map(({ url, body: body2, json }) => {
    let attributes = `type="application/json" data-type="svelte-data" data-url="${url}"`;
    if (body2)
      attributes += ` data-body="${hash(body2)}"`;
    return `<script ${attributes}>${json}<\/script>`;
  }).join("\n\n			")}
		`.replace(/^\t{2}/gm, "");
  const headers = {
    "content-type": "text/html"
  };
  if (maxage) {
    headers["cache-control"] = `${is_private ? "private" : "public"}, max-age=${maxage}`;
  }
  if (!options2.floc) {
    headers["permissions-policy"] = "interest-cohort=()";
  }
  return {
    status,
    headers,
    body: options2.template({ head, body })
  };
}
function try_serialize(data, fail) {
  try {
    return devalue(data);
  } catch (err) {
    if (fail)
      fail(err);
    return null;
  }
}
function serialize_error(error3) {
  if (!error3)
    return null;
  let serialized = try_serialize(error3);
  if (!serialized) {
    const { name, message, stack } = error3;
    serialized = try_serialize({ ...error3, name, message, stack });
  }
  if (!serialized) {
    serialized = "{}";
  }
  return serialized;
}
function normalize(loaded) {
  const has_error_status = loaded.status && loaded.status >= 400 && loaded.status <= 599 && !loaded.redirect;
  if (loaded.error || has_error_status) {
    const status = loaded.status;
    if (!loaded.error && has_error_status) {
      return {
        status: status || 500,
        error: new Error()
      };
    }
    const error3 = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
    if (!(error3 instanceof Error)) {
      return {
        status: 500,
        error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error3}"`)
      };
    }
    if (!status || status < 400 || status > 599) {
      console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
      return { status: 500, error: error3 };
    }
    return { status, error: error3 };
  }
  if (loaded.redirect) {
    if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be accompanied by a 3xx status code')
      };
    }
    if (typeof loaded.redirect !== "string") {
      return {
        status: 500,
        error: new Error('"redirect" property returned from load() must be a string')
      };
    }
  }
  return loaded;
}
var absolute = /^([a-z]+:)?\/?\//;
function resolve(base, path) {
  const base_match = absolute.exec(base);
  const path_match = absolute.exec(path);
  if (!base_match) {
    throw new Error(`bad base path: "${base}"`);
  }
  const baseparts = path_match ? [] : base.slice(base_match[0].length).split("/");
  const pathparts = path_match ? path.slice(path_match[0].length).split("/") : path.split("/");
  baseparts.pop();
  for (let i = 0; i < pathparts.length; i += 1) {
    const part = pathparts[i];
    if (part === ".")
      continue;
    else if (part === "..")
      baseparts.pop();
    else
      baseparts.push(part);
  }
  const prefix = path_match && path_match[0] || base_match && base_match[0] || "";
  return `${prefix}${baseparts.join("/")}`;
}
var s = JSON.stringify;
async function load_node({
  request,
  options: options2,
  state,
  route,
  page: page2,
  node,
  $session,
  context,
  is_leaf,
  is_error,
  status,
  error: error3
}) {
  const { module: module2 } = node;
  let uses_credentials = false;
  const fetched = [];
  let loaded;
  if (module2.load) {
    const load_input = {
      page: page2,
      get session() {
        uses_credentials = true;
        return $session;
      },
      fetch: async (resource, opts = {}) => {
        let url;
        if (typeof resource === "string") {
          url = resource;
        } else {
          url = resource.url;
          opts = {
            method: resource.method,
            headers: resource.headers,
            body: resource.body,
            mode: resource.mode,
            credentials: resource.credentials,
            cache: resource.cache,
            redirect: resource.redirect,
            referrer: resource.referrer,
            integrity: resource.integrity,
            ...opts
          };
        }
        const resolved = resolve(request.path, url.split("?")[0]);
        let response;
        const filename = resolved.replace(options2.paths.assets, "").slice(1);
        const filename_html = `${filename}/index.html`;
        const asset = options2.manifest.assets.find((d) => d.file === filename || d.file === filename_html);
        if (asset) {
          response = options2.read ? new Response(options2.read(asset.file), {
            headers: asset.type ? {
              "content-type": asset.type
            } : {}
          }) : await fetch(`http://${page2.host}/${asset.file}`, opts);
        } else if (resolved.startsWith(options2.paths.base || "/") && !resolved.startsWith("//")) {
          const relative = resolved.replace(options2.paths.base, "");
          const headers = { ...opts.headers };
          if (opts.credentials !== "omit") {
            uses_credentials = true;
            headers.cookie = request.headers.cookie;
            if (!headers.authorization) {
              headers.authorization = request.headers.authorization;
            }
          }
          if (opts.body && typeof opts.body !== "string") {
            throw new Error("Request body must be a string");
          }
          const search = url.includes("?") ? url.slice(url.indexOf("?") + 1) : "";
          const rendered = await respond({
            host: request.host,
            method: opts.method || "GET",
            headers,
            path: relative,
            rawBody: opts.body,
            query: new URLSearchParams(search)
          }, options2, {
            fetched: url,
            initiator: route
          });
          if (rendered) {
            if (state.prerender) {
              state.prerender.dependencies.set(relative, rendered);
            }
            response = new Response(rendered.body, {
              status: rendered.status,
              headers: rendered.headers
            });
          }
        } else {
          if (resolved.startsWith("//")) {
            throw new Error(`Cannot request protocol-relative URL (${url}) in server-side fetch`);
          }
          if (typeof request.host !== "undefined") {
            const { hostname: fetch_hostname } = new URL(url);
            const [server_hostname] = request.host.split(":");
            if (`.${fetch_hostname}`.endsWith(`.${server_hostname}`) && opts.credentials !== "omit") {
              uses_credentials = true;
              opts.headers = {
                ...opts.headers,
                cookie: request.headers.cookie
              };
            }
          }
          const external_request = new Request(url, opts);
          response = await options2.hooks.serverFetch.call(null, external_request);
        }
        if (response) {
          const proxy = new Proxy(response, {
            get(response2, key, receiver) {
              async function text() {
                const body = await response2.text();
                const headers = {};
                for (const [key2, value] of response2.headers) {
                  if (key2 !== "etag" && key2 !== "set-cookie")
                    headers[key2] = value;
                }
                if (!opts.body || typeof opts.body === "string") {
                  fetched.push({
                    url,
                    body: opts.body,
                    json: `{"status":${response2.status},"statusText":${s(response2.statusText)},"headers":${s(headers)},"body":${escape(body)}}`
                  });
                }
                return body;
              }
              if (key === "text") {
                return text;
              }
              if (key === "json") {
                return async () => {
                  return JSON.parse(await text());
                };
              }
              return Reflect.get(response2, key, response2);
            }
          });
          return proxy;
        }
        return response || new Response("Not found", {
          status: 404
        });
      },
      context: { ...context }
    };
    if (is_error) {
      load_input.status = status;
      load_input.error = error3;
    }
    loaded = await module2.load.call(null, load_input);
  } else {
    loaded = {};
  }
  if (!loaded && is_leaf && !is_error)
    return;
  if (!loaded) {
    throw new Error(`${node.entry} - load must return a value except for page fall through`);
  }
  return {
    node,
    loaded: normalize(loaded),
    context: loaded.context || context,
    fetched,
    uses_credentials
  };
}
var escaped = {
  "<": "\\u003C",
  ">": "\\u003E",
  "/": "\\u002F",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\0": "\\0",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
function escape(str) {
  let result = '"';
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charAt(i);
    const code = char.charCodeAt(0);
    if (char === '"') {
      result += '\\"';
    } else if (char in escaped) {
      result += escaped[char];
    } else if (code >= 55296 && code <= 57343) {
      const next = str.charCodeAt(i + 1);
      if (code <= 56319 && next >= 56320 && next <= 57343) {
        result += char + str[++i];
      } else {
        result += `\\u${code.toString(16).toUpperCase()}`;
      }
    } else {
      result += char;
    }
  }
  result += '"';
  return result;
}
function coalesce_to_error(err) {
  return err instanceof Error ? err : new Error(JSON.stringify(err));
}
async function respond_with_error({ request, options: options2, state, $session, status, error: error3 }) {
  const default_layout = await options2.load_component(options2.manifest.layout);
  const default_error = await options2.load_component(options2.manifest.error);
  const page2 = {
    host: request.host,
    path: request.path,
    query: request.query,
    params: {}
  };
  const loaded = await load_node({
    request,
    options: options2,
    state,
    route: null,
    page: page2,
    node: default_layout,
    $session,
    context: {},
    is_leaf: false,
    is_error: false
  });
  const branch = [
    loaded,
    await load_node({
      request,
      options: options2,
      state,
      route: null,
      page: page2,
      node: default_error,
      $session,
      context: loaded ? loaded.context : {},
      is_leaf: false,
      is_error: true,
      status,
      error: error3
    })
  ];
  try {
    return await render_response({
      options: options2,
      $session,
      page_config: {
        hydrate: options2.hydrate,
        router: options2.router,
        ssr: options2.ssr
      },
      status,
      error: error3,
      branch,
      page: page2
    });
  } catch (err) {
    const error4 = coalesce_to_error(err);
    options2.handle_error(error4);
    return {
      status: 500,
      headers: {},
      body: error4.stack
    };
  }
}
async function respond$1({ request, options: options2, state, $session, route }) {
  const match = route.pattern.exec(request.path);
  const params = route.params(match);
  const page2 = {
    host: request.host,
    path: request.path,
    query: request.query,
    params
  };
  let nodes;
  try {
    nodes = await Promise.all(route.a.map((id) => id ? options2.load_component(id) : void 0));
  } catch (err) {
    const error4 = coalesce_to_error(err);
    options2.handle_error(error4);
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 500,
      error: error4
    });
  }
  const leaf = nodes[nodes.length - 1].module;
  const page_config = {
    ssr: "ssr" in leaf ? !!leaf.ssr : options2.ssr,
    router: "router" in leaf ? !!leaf.router : options2.router,
    hydrate: "hydrate" in leaf ? !!leaf.hydrate : options2.hydrate
  };
  if (!leaf.prerender && state.prerender && !state.prerender.all) {
    return {
      status: 204,
      headers: {},
      body: ""
    };
  }
  let branch;
  let status = 200;
  let error3;
  ssr:
    if (page_config.ssr) {
      let context = {};
      branch = [];
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        let loaded;
        if (node) {
          try {
            loaded = await load_node({
              request,
              options: options2,
              state,
              route,
              page: page2,
              node,
              $session,
              context,
              is_leaf: i === nodes.length - 1,
              is_error: false
            });
            if (!loaded)
              return;
            if (loaded.loaded.redirect) {
              return {
                status: loaded.loaded.status,
                headers: {
                  location: encodeURI(loaded.loaded.redirect)
                }
              };
            }
            if (loaded.loaded.error) {
              ({ status, error: error3 } = loaded.loaded);
            } else {
              branch.push(loaded);
            }
          } catch (err) {
            const e = coalesce_to_error(err);
            options2.handle_error(e);
            status = 500;
            error3 = e;
          }
          if (error3) {
            while (i--) {
              if (route.b[i]) {
                const error_node = await options2.load_component(route.b[i]);
                let node_loaded;
                let j = i;
                while (!(node_loaded = branch[j])) {
                  j -= 1;
                }
                let error_loaded;
                try {
                  error_loaded = await load_node({
                    request,
                    options: options2,
                    state,
                    route,
                    page: page2,
                    node: error_node,
                    $session,
                    context: node_loaded.context,
                    is_leaf: false,
                    is_error: true,
                    status,
                    error: error3
                  });
                  if (error_loaded.loaded.error) {
                    continue;
                  }
                  branch = branch.slice(0, j + 1).concat(error_loaded);
                  break ssr;
                } catch (err) {
                  const e = coalesce_to_error(err);
                  options2.handle_error(e);
                  continue;
                }
              }
            }
            return await respond_with_error({
              request,
              options: options2,
              state,
              $session,
              status,
              error: error3
            });
          }
        }
        if (loaded && loaded.loaded.context) {
          context = {
            ...context,
            ...loaded.loaded.context
          };
        }
      }
    }
  try {
    return await render_response({
      options: options2,
      $session,
      page_config,
      status,
      error: error3,
      branch: branch && branch.filter(Boolean),
      page: page2
    });
  } catch (err) {
    const error4 = coalesce_to_error(err);
    options2.handle_error(error4);
    return await respond_with_error({
      request,
      options: options2,
      state,
      $session,
      status: 500,
      error: error4
    });
  }
}
async function render_page(request, route, options2, state) {
  if (state.initiator === route) {
    return {
      status: 404,
      headers: {},
      body: `Not found: ${request.path}`
    };
  }
  const $session = await options2.hooks.getSession(request);
  const response = await respond$1({
    request,
    options: options2,
    state,
    $session,
    route
  });
  if (response) {
    return response;
  }
  if (state.fetched) {
    return {
      status: 500,
      headers: {},
      body: `Bad request in load function: failed to fetch ${state.fetched}`
    };
  }
}
function read_only_form_data() {
  const map2 = new Map();
  return {
    append(key, value) {
      if (map2.has(key)) {
        (map2.get(key) || []).push(value);
      } else {
        map2.set(key, [value]);
      }
    },
    data: new ReadOnlyFormData(map2)
  };
}
var ReadOnlyFormData = class {
  #map;
  constructor(map2) {
    this.#map = map2;
  }
  get(key) {
    const value = this.#map.get(key);
    return value && value[0];
  }
  getAll(key) {
    return this.#map.get(key);
  }
  has(key) {
    return this.#map.has(key);
  }
  *[Symbol.iterator]() {
    for (const [key, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *entries() {
    for (const [key, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield [key, value[i]];
      }
    }
  }
  *keys() {
    for (const [key] of this.#map)
      yield key;
  }
  *values() {
    for (const [, value] of this.#map) {
      for (let i = 0; i < value.length; i += 1) {
        yield value[i];
      }
    }
  }
};
function parse_body(raw, headers) {
  if (!raw || typeof raw !== "string")
    return raw;
  const [type, ...directives] = headers["content-type"].split(/;\s*/);
  switch (type) {
    case "text/plain":
      return raw;
    case "application/json":
      return JSON.parse(raw);
    case "application/x-www-form-urlencoded":
      return get_urlencoded(raw);
    case "multipart/form-data": {
      const boundary = directives.find((directive) => directive.startsWith("boundary="));
      if (!boundary)
        throw new Error("Missing boundary");
      return get_multipart(raw, boundary.slice("boundary=".length));
    }
    default:
      throw new Error(`Invalid Content-Type ${type}`);
  }
}
function get_urlencoded(text) {
  const { data, append } = read_only_form_data();
  text.replace(/\+/g, " ").split("&").forEach((str) => {
    const [key, value] = str.split("=");
    append(decodeURIComponent(key), decodeURIComponent(value));
  });
  return data;
}
function get_multipart(text, boundary) {
  const parts = text.split(`--${boundary}`);
  if (parts[0] !== "" || parts[parts.length - 1].trim() !== "--") {
    throw new Error("Malformed form data");
  }
  const { data, append } = read_only_form_data();
  parts.slice(1, -1).forEach((part) => {
    const match = /\s*([\s\S]+?)\r\n\r\n([\s\S]*)\s*/.exec(part);
    if (!match) {
      throw new Error("Malformed form data");
    }
    const raw_headers = match[1];
    const body = match[2].trim();
    let key;
    const headers = {};
    raw_headers.split("\r\n").forEach((str) => {
      const [raw_header, ...raw_directives] = str.split("; ");
      let [name, value] = raw_header.split(": ");
      name = name.toLowerCase();
      headers[name] = value;
      const directives = {};
      raw_directives.forEach((raw_directive) => {
        const [name2, value2] = raw_directive.split("=");
        directives[name2] = JSON.parse(value2);
      });
      if (name === "content-disposition") {
        if (value !== "form-data")
          throw new Error("Malformed form data");
        if (directives.filename) {
          throw new Error("File upload is not yet implemented");
        }
        if (directives.name) {
          key = directives.name;
        }
      }
    });
    if (!key)
      throw new Error("Malformed form data");
    append(key, body);
  });
  return data;
}
async function respond(incoming, options2, state = {}) {
  if (incoming.path !== "/" && options2.trailing_slash !== "ignore") {
    const has_trailing_slash = incoming.path.endsWith("/");
    if (has_trailing_slash && options2.trailing_slash === "never" || !has_trailing_slash && options2.trailing_slash === "always" && !(incoming.path.split("/").pop() || "").includes(".")) {
      const path = has_trailing_slash ? incoming.path.slice(0, -1) : incoming.path + "/";
      const q = incoming.query.toString();
      return {
        status: 301,
        headers: {
          location: encodeURI(path + (q ? `?${q}` : ""))
        }
      };
    }
  }
  try {
    const headers = lowercase_keys(incoming.headers);
    return await options2.hooks.handle({
      request: {
        ...incoming,
        headers,
        body: parse_body(incoming.rawBody, headers),
        params: {},
        locals: {}
      },
      resolve: async (request) => {
        if (state.prerender && state.prerender.fallback) {
          return await render_response({
            options: options2,
            $session: await options2.hooks.getSession(request),
            page_config: { ssr: false, router: true, hydrate: true },
            status: 200,
            branch: []
          });
        }
        for (const route of options2.manifest.routes) {
          if (!route.pattern.test(request.path))
            continue;
          const response = route.type === "endpoint" ? await render_endpoint(request, route) : await render_page(request, route, options2, state);
          if (response) {
            if (response.status === 200) {
              if (!/(no-store|immutable)/.test(response.headers["cache-control"])) {
                const etag = `"${hash(response.body || "")}"`;
                if (request.headers["if-none-match"] === etag) {
                  return {
                    status: 304,
                    headers: {},
                    body: ""
                  };
                }
                response.headers["etag"] = etag;
              }
            }
            return response;
          }
        }
        const $session = await options2.hooks.getSession(request);
        return await respond_with_error({
          request,
          options: options2,
          state,
          $session,
          status: 404,
          error: new Error(`Not found: ${request.path}`)
        });
      }
    });
  } catch (err) {
    const e = coalesce_to_error(err);
    options2.handle_error(e);
    return {
      status: 500,
      headers: {},
      body: options2.dev ? e.stack : e.message
    };
  }
}

// .svelte-kit/output/server/app.js
var import_cookie = __toModule(require_cookie());

// node_modules/@lukeed/uuid/dist/index.mjs
init_shims();
var IDX = 256;
var HEX = [];
var BUFFER;
while (IDX--)
  HEX[IDX] = (IDX + 256).toString(16).substring(1);
function v4() {
  var i = 0, num, out = "";
  if (!BUFFER || IDX + 16 > 256) {
    BUFFER = Array(i = 256);
    while (i--)
      BUFFER[i] = 256 * Math.random() | 0;
    i = IDX = 0;
  }
  for (; i < 16; i++) {
    num = BUFFER[IDX + i];
    if (i == 6)
      out += HEX[num & 15 | 64];
    else if (i == 8)
      out += HEX[num & 63 | 128];
    else
      out += HEX[num];
    if (i & 1 && i > 1 && i < 11)
      out += "-";
  }
  IDX++;
  return out;
}

// .svelte-kit/output/server/app.js
function noop2() {
}
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    return noop2;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
var current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}
function getContext(key) {
  return get_current_component().$$.context.get(key);
}
Promise.resolve();
var escaped2 = {
  '"': "&quot;",
  "'": "&#39;",
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;"
};
function escape2(html) {
  return String(html).replace(/["'&<>]/g, (match) => escaped2[match]);
}
function each(items, fn) {
  let str = "";
  for (let i = 0; i < items.length; i += 1) {
    str += fn(items[i], i);
  }
  return str;
}
var missing_component = {
  $$render: () => ""
};
function validate_component(component, name) {
  if (!component || !component.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
  }
  return component;
}
var on_destroy;
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(parent_component ? parent_component.$$.context : context || []),
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css2) => css2.code).join("\n"),
          map: null
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || boolean && !value)
    return "";
  return ` ${name}${value === true ? "" : `=${typeof value === "string" ? JSON.stringify(escape2(value)) : `"${value}"`}`}`;
}
function add_classes(classes) {
  return classes ? ` class="${classes}"` : "";
}
function afterUpdate() {
}
var css$9 = {
  code: "#svelte-announcer.svelte-1j55zn5{position:absolute;left:0;top:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px}",
  map: `{"version":3,"file":"root.svelte","sources":["root.svelte"],"sourcesContent":["<!-- This file is generated by @sveltejs/kit \u2014 do not edit it! -->\\n<script>\\n\\timport { setContext, afterUpdate, onMount } from 'svelte';\\n\\n\\t// stores\\n\\texport let stores;\\n\\texport let page;\\n\\n\\texport let components;\\n\\texport let props_0 = null;\\n\\texport let props_1 = null;\\n\\texport let props_2 = null;\\n\\n\\tsetContext('__svelte__', stores);\\n\\n\\t$: stores.page.set(page);\\n\\tafterUpdate(stores.page.notify);\\n\\n\\tlet mounted = false;\\n\\tlet navigated = false;\\n\\tlet title = null;\\n\\n\\tonMount(() => {\\n\\t\\tconst unsubscribe = stores.page.subscribe(() => {\\n\\t\\t\\tif (mounted) {\\n\\t\\t\\t\\tnavigated = true;\\n\\t\\t\\t\\ttitle = document.title || 'untitled page';\\n\\t\\t\\t}\\n\\t\\t});\\n\\n\\t\\tmounted = true;\\n\\t\\treturn unsubscribe;\\n\\t});\\n<\/script>\\n\\n<svelte:component this={components[0]} {...(props_0 || {})}>\\n\\t{#if components[1]}\\n\\t\\t<svelte:component this={components[1]} {...(props_1 || {})}>\\n\\t\\t\\t{#if components[2]}\\n\\t\\t\\t\\t<svelte:component this={components[2]} {...(props_2 || {})}/>\\n\\t\\t\\t{/if}\\n\\t\\t</svelte:component>\\n\\t{/if}\\n</svelte:component>\\n\\n{#if mounted}\\n\\t<div id=\\"svelte-announcer\\" aria-live=\\"assertive\\" aria-atomic=\\"true\\">\\n\\t\\t{#if navigated}\\n\\t\\t\\t{title}\\n\\t\\t{/if}\\n\\t</div>\\n{/if}\\n\\n<style>\\n\\t#svelte-announcer {\\n\\t\\tposition: absolute;\\n\\t\\tleft: 0;\\n\\t\\ttop: 0;\\n\\t\\tclip: rect(0 0 0 0);\\n\\t\\tclip-path: inset(50%);\\n\\t\\toverflow: hidden;\\n\\t\\twhite-space: nowrap;\\n\\t\\twidth: 1px;\\n\\t\\theight: 1px;\\n\\t}\\n</style>"],"names":[],"mappings":"AAsDC,iBAAiB,eAAC,CAAC,AAClB,QAAQ,CAAE,QAAQ,CAClB,IAAI,CAAE,CAAC,CACP,GAAG,CAAE,CAAC,CACN,IAAI,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CACnB,SAAS,CAAE,MAAM,GAAG,CAAC,CACrB,QAAQ,CAAE,MAAM,CAChB,WAAW,CAAE,MAAM,CACnB,KAAK,CAAE,GAAG,CACV,MAAM,CAAE,GAAG,AACZ,CAAC"}`
};
var Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page: page2 } = $$props;
  let { components } = $$props;
  let { props_0 = null } = $$props;
  let { props_1 = null } = $$props;
  let { props_2 = null } = $$props;
  setContext("__svelte__", stores);
  afterUpdate(stores.page.notify);
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page2 !== void 0)
    $$bindings.page(page2);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0)
    $$bindings.components(components);
  if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
    $$bindings.props_0(props_0);
  if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
    $$bindings.props_1(props_1);
  if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
    $$bindings.props_2(props_2);
  $$result.css.add(css$9);
  {
    stores.page.set(page2);
  }
  return `


${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
    default: () => `${components[1] ? `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
      default: () => `${components[2] ? `${validate_component(components[2] || missing_component, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {})}` : ``}`
    })}` : ``}`
  })}

${``}`;
});
function set_paths(paths) {
}
function set_prerendering(value) {
}
var handle = async ({ request, resolve: resolve2 }) => {
  const cookies = import_cookie.default.parse(request.headers.cookie || "");
  request.locals.userid = cookies.userid || v4();
  if (request.query.has("_method")) {
    request.method = request.query.get("_method").toUpperCase();
  }
  const response = await resolve2(request);
  if (!cookies.userid) {
    response.headers["set-cookie"] = `userid=${request.locals.userid}; Path=/; HttpOnly`;
  }
  return response;
};
var user_hooks = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  handle
});
var template = ({ head, body }) => '<!DOCTYPE html>\n<html lang="en">\n	<head>\n		<meta charset="utf-8" />\n		<link rel="icon" href="/favicon.png" />\n		<meta name="viewport" content="width=device-width, initial-scale=1" />\n		\n		<!-- UIkit CSS -->\n		 <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/uikit@3.7.1/dist/css/uikit.min.css" /> \n\n		<!-- UIkit JS -->\n		<script src="https://cdn.jsdelivr.net/npm/uikit@3.7.1/dist/js/uikit.min.js"><\/script>\n		<script src="https://cdn.jsdelivr.net/npm/uikit@3.7.1/dist/js/uikit-icons.min.js"><\/script>\n		\n		' + head + '\n		\n	</head>\n	<body>\n		<div id="svelte">' + body + "</div>\n	</body>\n</html>\n\n\n";
var options = null;
var default_settings = { paths: { "base": "", "assets": "/." } };
function init(settings = default_settings) {
  set_paths(settings.paths);
  set_prerendering(settings.prerendering || false);
  options = {
    amp: false,
    dev: false,
    entry: {
      file: "/./_app/start-2008e8b9.js",
      css: ["/./_app/assets/start-a8cd1609.css"],
      js: ["/./_app/start-2008e8b9.js", "/./_app/chunks/vendor-3a42b241.js"]
    },
    fetched: void 0,
    floc: false,
    get_component_path: (id) => "/./_app/" + entry_lookup[id],
    get_stack: (error22) => String(error22),
    handle_error: (error22) => {
      if (error22.frame) {
        console.error(error22.frame);
      }
      console.error(error22.stack);
      error22.stack = options.get_stack(error22);
    },
    hooks: get_hooks(user_hooks),
    hydrate: true,
    initiator: void 0,
    load_component,
    manifest,
    paths: settings.paths,
    read: settings.read,
    root: Root,
    service_worker: null,
    router: true,
    ssr: true,
    target: "#svelte",
    template,
    trailing_slash: "never"
  };
}
var empty = () => ({});
var manifest = {
  assets: [{ "file": ".DS_Store", "size": 6148, "type": null }, { "file": "favicon.png", "size": 1571, "type": "image/png" }, { "file": "json_files/faq_en.json", "size": 9594, "type": "application/json" }, { "file": "json_files/faq_nl.json", "size": 7370, "type": "application/json" }, { "file": "json_files/frdata.json", "size": 1411, "type": "application/json" }, { "file": "json_files/new_json_old.json", "size": 6138, "type": "application/json" }, { "file": "json_files/research_economics.json", "size": 958, "type": "application/json" }, { "file": "json_files/research_politics.json", "size": 798, "type": "application/json" }, { "file": "json_files/research_sciences.json", "size": 1168, "type": "application/json" }, { "file": "pictures/.DS_Store", "size": 6148, "type": null }, { "file": "pictures/banner.jpg", "size": 310087, "type": "image/jpeg" }, { "file": "pictures/elon.jpeg", "size": 93464, "type": "image/jpeg" }, { "file": "pictures/logo_economics.png", "size": 78425, "type": "image/png" }, { "file": "pictures/logo_political.png", "size": 72985, "type": "image/png" }, { "file": "pictures/logo_sciences.png", "size": 54450, "type": "image/png" }, { "file": "pictures/logo_ugent.png", "size": 56311, "type": "image/png" }, { "file": "pictures/neil.jpeg", "size": 79549, "type": "image/jpeg" }, { "file": "pictures/train1.jpg", "size": 361290, "type": "image/jpeg" }, { "file": "pictures/train1_old.jpg", "size": 165383, "type": "image/jpeg" }, { "file": "pictures/train2.jpg", "size": 416607, "type": "image/jpeg" }, { "file": "pictures/train3.jpg", "size": 276503, "type": "image/jpeg" }, { "file": "pictures/train3_old.jpg", "size": 436789, "type": "image/jpeg" }, { "file": "robots.txt", "size": 67, "type": "text/plain" }, { "file": "stories_pics/.DS_Store", "size": 6148, "type": null }, { "file": "stories_pics/Peter.jpg", "size": 94126, "type": "image/jpeg" }, { "file": "stories_pics/mieke_van_houtte.jpg", "size": 326042, "type": "image/jpeg" }, { "file": "stories_pics/profile-picture-hans-verbeeck.png", "size": 366971, "type": "image/png" }, { "file": "stories_pics/thomas.jpg", "size": 566426, "type": "image/jpeg" }, { "file": "svelte-welcome.png", "size": 360807, "type": "image/png" }, { "file": "svelte-welcome.webp", "size": 115470, "type": "image/webp" }],
  layout: "src/routes/__layout.svelte",
  error: ".svelte-kit/build/components/error.svelte",
  routes: [
    {
      type: "page",
      pattern: /^\/$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/index.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/stories copy\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/stories copy.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/about_us\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/about_us.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/research\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/research.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/stories\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/stories.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/faq_en\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/faq_en.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/faqs\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/faqs.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    },
    {
      type: "page",
      pattern: /^\/map\/?$/,
      params: empty,
      a: ["src/routes/__layout.svelte", "src/routes/map.svelte"],
      b: [".svelte-kit/build/components/error.svelte"]
    }
  ]
};
var get_hooks = (hooks) => ({
  getSession: hooks.getSession || (() => ({})),
  handle: hooks.handle || (({ request, resolve: resolve2 }) => resolve2(request)),
  serverFetch: hooks.serverFetch || fetch
});
var module_lookup = {
  "src/routes/__layout.svelte": () => Promise.resolve().then(function() {
    return __layout;
  }),
  ".svelte-kit/build/components/error.svelte": () => Promise.resolve().then(function() {
    return error2;
  }),
  "src/routes/index.svelte": () => Promise.resolve().then(function() {
    return index;
  }),
  "src/routes/stories copy.svelte": () => Promise.resolve().then(function() {
    return stories_copy;
  }),
  "src/routes/about_us.svelte": () => Promise.resolve().then(function() {
    return about_us;
  }),
  "src/routes/research.svelte": () => Promise.resolve().then(function() {
    return research;
  }),
  "src/routes/stories.svelte": () => Promise.resolve().then(function() {
    return stories;
  }),
  "src/routes/faq_en.svelte": () => Promise.resolve().then(function() {
    return faq_en;
  }),
  "src/routes/faqs.svelte": () => Promise.resolve().then(function() {
    return faqs;
  }),
  "src/routes/map.svelte": () => Promise.resolve().then(function() {
    return map;
  })
};
var metadata_lookup = { "src/routes/__layout.svelte": { "entry": "/./_app/pages/__layout.svelte-936421be.js", "css": ["/./_app/assets/pages/__layout.svelte-44b8b8c2.css"], "js": ["/./_app/pages/__layout.svelte-936421be.js", "/./_app/chunks/vendor-3a42b241.js"], "styles": [] }, ".svelte-kit/build/components/error.svelte": { "entry": "/./_app/error.svelte-08c0d41d.js", "css": [], "js": ["/./_app/error.svelte-08c0d41d.js", "/./_app/chunks/vendor-3a42b241.js"], "styles": [] }, "src/routes/index.svelte": { "entry": "/./_app/pages/index.svelte-81ff75d4.js", "css": [], "js": ["/./_app/pages/index.svelte-81ff75d4.js", "/./_app/chunks/vendor-3a42b241.js"], "styles": [] }, "src/routes/stories copy.svelte": { "entry": "/./_app/pages/stories copy.svelte-daba5006.js", "css": ["/./_app/assets/pages/stories copy.svelte-8173c119.css"], "js": ["/./_app/pages/stories copy.svelte-daba5006.js", "/./_app/chunks/vendor-3a42b241.js", "/./_app/chunks/frdata-43c8992d.js"], "styles": [] }, "src/routes/about_us.svelte": { "entry": "/./_app/pages/about_us.svelte-53309354.js", "css": ["/./_app/assets/pages/about_us.svelte-725309bd.css"], "js": ["/./_app/pages/about_us.svelte-53309354.js", "/./_app/chunks/vendor-3a42b241.js"], "styles": [] }, "src/routes/research.svelte": { "entry": "/./_app/pages/research.svelte-32b89d06.js", "css": [], "js": ["/./_app/pages/research.svelte-32b89d06.js", "/./_app/chunks/vendor-3a42b241.js"], "styles": [] }, "src/routes/stories.svelte": { "entry": "/./_app/pages/stories.svelte-47029729.js", "css": ["/./_app/assets/pages/stories.svelte-a92938b3.css"], "js": ["/./_app/pages/stories.svelte-47029729.js", "/./_app/chunks/vendor-3a42b241.js", "/./_app/chunks/frdata-43c8992d.js"], "styles": [] }, "src/routes/faq_en.svelte": { "entry": "/./_app/pages/faq_en.svelte-283828a1.js", "css": ["/./_app/assets/pages/faq_en.svelte-7590e057.css"], "js": ["/./_app/pages/faq_en.svelte-283828a1.js", "/./_app/chunks/vendor-3a42b241.js"], "styles": [] }, "src/routes/faqs.svelte": { "entry": "/./_app/pages/faqs.svelte-2b53a4f7.js", "css": ["/./_app/assets/pages/faq_en.svelte-7590e057.css"], "js": ["/./_app/pages/faqs.svelte-2b53a4f7.js", "/./_app/chunks/vendor-3a42b241.js", "/./_app/pages/faq_en.svelte-283828a1.js"], "styles": [] }, "src/routes/map.svelte": { "entry": "/./_app/pages/map.svelte-8ad8fb7f.js", "css": [], "js": ["/./_app/pages/map.svelte-8ad8fb7f.js", "/./_app/chunks/vendor-3a42b241.js"], "styles": [] } };
async function load_component(file) {
  return {
    module: await module_lookup[file](),
    ...metadata_lookup[file]
  };
}
function render(request, {
  prerender: prerender2
} = {}) {
  const host = request.headers["host"];
  return respond({ ...request, host }, options, { prerender: prerender2 });
}
var getStores = () => {
  const stores = getContext("__svelte__");
  return {
    page: {
      subscribe: stores.page.subscribe
    },
    navigating: {
      subscribe: stores.navigating.subscribe
    },
    get preloading() {
      console.error("stores.preloading is deprecated; use stores.navigating instead");
      return {
        subscribe: stores.navigating.subscribe
      };
    },
    session: stores.session
  };
};
var page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
var airplane = "/_app/assets/background-alt.0f9d5115.png";
var css$8 = {
  code: ".uk-navbar-nav.svelte-1l7wntg>li.svelte-1l7wntg>a.svelte-1l7wntg{color:rgb(79, 79, 79)}.uk-navbar-nav.svelte-1l7wntg>li.svelte-1l7wntg:hover>a.svelte-1l7wntg,.uk-navbar-nav.svelte-1l7wntg>li.svelte-1l7wntg>a.svelte-1l7wntg:focus{color:#005599}span.svelte-1l7wntg.svelte-1l7wntg.svelte-1l7wntg{display:inline-block;margin-right:-3px}.quote.svelte-1l7wntg.svelte-1l7wntg.svelte-1l7wntg{font-weight:100;font-family:'Helvetica';font-size:medium;color:#8a8a8a}",
  map: `{"version":3,"file":"navbar_home.svelte","sources":["navbar_home.svelte"],"sourcesContent":["<script>\\n    \\timport { page } from '$app/stores';\\n        import airplane from '/src/lib/navbar_home/background-alt.png';\\n<\/script>\\n\\n<div class=\\"uk-position-relative\\" style = \\"height: 80vh;\\"> <!--added new height-->\\n    <img src={airplane} alt=\\"\\">\\n    <div class=\\"uk-position-top\\">\\n\\n        <nav class=\\"uk-navbar uk-navbar-transparent\\">\\n            <div class=\\"uk-navbar-center\\">\\n                <div class = \\"uk-navbar-item\\"> \\n                <span style = \\"font-size:20px; font-weight:100;\\"> Academic </span>\\n                <span style = \\"font-size:20px; font-weight:300;\\">Travel</span>\\n                </div>   \\n            </div>\\n\\n            <div class=\\"uk-navbar-left\\">\\n                <ul class=\\"uk-navbar-nav uk-visible@m\\">\\n                    <li class:active={$page.path === '/'}><a sveltekit:prefetch href=\\"/\\">Home</a></li>\\n                    <li class:active={$page.path === '/map'}><a sveltekit:prefetch href=\\"/map\\">Map</a></li>\\n                    <li class:active={$page.path === '/stories'}><a sveltekit:prefetch href=\\"/stories\\">Community stories</a></li>\\n                </ul>\\n\\n                <div class=\\"uk-navbar-item uk-visible@m\\">\\n                </div>\\n            </div>\\n\\n            <div class=\\"uk-navbar-right\\">\\n                <ul class=\\"uk-navbar-nav uk-visible@m\\">\\n                    <li class:active={$page.path === '/faqs'}><a sveltekit:prefetch href=\\"/faqs\\">FAQ</a></li>\\n                    <li class:active={$page.path === '/research'}><a sveltekit:prefetch href=\\"/research\\">UGent Research</a></li>\\n                    <li class:active={$page.path === '/about_us'}><a sveltekit:prefetch href=\\"/about_us\\">About Us</a></li>\\n                </ul>\\n                <!-- svelte-ignore a11y-missing-content -->\\n                <a class=\\"uk-navbar-toggle uk-hidden@m\\" href=\\"#offcanvas\\" uk-toggle style = \\"font-size:25px; font-weight:300;\\">\u2261</a>\\n            </div>\\n        </nav>\\n\\n\\n        <div class=\\"uk-child-width-1-1@s uk-grid-collapse uk-text-left\\" uk-grid>\\n            <div>\\n                <div class=\\"uk-position-relative uk-visible-toggle\\" tabindex=\\"-1\\" uk-slideshow = \\"autoplay: true; autoplay-interval: 4500; pause-on-hover: true;\\">\\n                    <ul class=\\"uk-slideshow-items uk-margin-xlarge-top uk-padding-large-top\\"> <!--removed margin here-->\\n                        <li>\\n                            <div class=\\"uk-position-center uk-position-small uk-text-center\\">\\n                                <p class=\\"uk-margin-remove quote\\">\\"The views were just magnificent as the windows were really large.\\"</p>\\n                            </div>\\n                        </li>\\n                        <li>\\n                            <div class=\\"uk-position-center uk-position-small uk-text-center\\">\\n                                <p class=\\"uk-margin-remove quote\\">\\"The best experience was waking up on the flixbus in the morning, looking at the Swedish landscape and hoping to spot an elk!\\"</p>\\n                            </div>\\n                        </li>\\n                        <li>\\n                            <div class=\\"uk-position-center uk-position-small uk-text-center\\">\\n                                <p class=\\"uk-margin-remove quote\\">\\"Slow traveling on the cargo ship with plenty of time to talk, read, work and rest along the way.\\"</p>\\n                            </div>\\n                        </li>\\n                        <li>\\n                            <div class=\\"uk-position-center uk-position-small uk-text-center\\">\\n                                <p class=\\"uk-margin-remove quote\\">\\"I usually get really a lot of work done during long train trips!\\"</p>\\n                            </div>\\n                        </li>\\n                    </ul>\\n        \\n                    <a class=\\"uk-position-center-left uk-position-small uk-hidden-hover\\" style=\\"color:#d1d1d1;\\" href=\\"#\\" uk-slidenav-previous uk-slideshow-item=\\"previous\\"></a>\\n                    <a class=\\"uk-position-center-right uk-position-small uk-hidden-hover\\" style=\\"color:#d1d1d1;\\" href=\\"#\\" uk-slidenav-next uk-slideshow-item=\\"next\\"></a>\\n        \\n                </div>\\n            </div>\\n        </div>\\n\\n\\n\\n</div>\\n</div>\\n\\n\\n\\n<style>\\n\\n.uk-navbar-nav > li > a {\\n    color:rgb(79, 79, 79);\\n}\\n\\n.uk-navbar-nav > li:hover > a,\\n.uk-navbar-nav > li > a:focus,\\n.uk-navbar-nav > li.uk-open > a {\\n    color: #005599;\\n}\\n\\nspan{\\n    display: inline-block;\\n    margin-right: -3px;\\n}\\n\\n.quote{\\n    font-weight: 100;\\n    font-family: 'Helvetica';\\n    font-size:medium;\\n    color:#8a8a8a;\\n}\\n\\n</style>"],"names":[],"mappings":"AAkFA,6BAAc,CAAG,iBAAE,CAAG,CAAC,eAAC,CAAC,AACrB,MAAM,IAAI,EAAE,CAAC,CAAC,EAAE,CAAC,CAAC,EAAE,CAAC,AACzB,CAAC,AAED,6BAAc,CAAG,iBAAE,MAAM,CAAG,gBAAC,CAC7B,6BAAc,CAAG,iBAAE,CAAG,gBAAC,MAAM,AACG,CAAC,AAC7B,KAAK,CAAE,OAAO,AAClB,CAAC,AAED,iDAAI,CAAC,AACD,OAAO,CAAE,YAAY,CACrB,YAAY,CAAE,IAAI,AACtB,CAAC,AAED,mDAAM,CAAC,AACH,WAAW,CAAE,GAAG,CAChB,WAAW,CAAE,WAAW,CACxB,UAAU,MAAM,CAChB,MAAM,OAAO,AACjB,CAAC"}`
};
var Navbar_home = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$result.css.add(css$8);
  $$unsubscribe_page();
  return `<div class="${"uk-position-relative"}" style="${"height: 80vh;"}">
    <img${add_attribute("src", airplane, 0)} alt="${""}">
    <div class="${"uk-position-top"}"><nav class="${"uk-navbar uk-navbar-transparent"}"><div class="${"uk-navbar-center"}"><div class="${"uk-navbar-item"}"><span style="${"font-size:20px; font-weight:100;"}" class="${"svelte-1l7wntg"}">Academic </span>
                <span style="${"font-size:20px; font-weight:300;"}" class="${"svelte-1l7wntg"}">Travel</span></div></div>

            <div class="${"uk-navbar-left"}"><ul class="${"uk-navbar-nav uk-visible@m svelte-1l7wntg"}"><li class="${["svelte-1l7wntg", $page.path === "/" ? "active" : ""].join(" ").trim()}"><a sveltekit:prefetch href="${"/"}" class="${"svelte-1l7wntg"}">Home</a></li>
                    <li class="${["svelte-1l7wntg", $page.path === "/map" ? "active" : ""].join(" ").trim()}"><a sveltekit:prefetch href="${"/map"}" class="${"svelte-1l7wntg"}">Map</a></li>
                    <li class="${["svelte-1l7wntg", $page.path === "/stories" ? "active" : ""].join(" ").trim()}"><a sveltekit:prefetch href="${"/stories"}" class="${"svelte-1l7wntg"}">Community stories</a></li></ul>

                <div class="${"uk-navbar-item uk-visible@m"}"></div></div>

            <div class="${"uk-navbar-right"}"><ul class="${"uk-navbar-nav uk-visible@m svelte-1l7wntg"}"><li class="${["svelte-1l7wntg", $page.path === "/faqs" ? "active" : ""].join(" ").trim()}"><a sveltekit:prefetch href="${"/faqs"}" class="${"svelte-1l7wntg"}">FAQ</a></li>
                    <li class="${["svelte-1l7wntg", $page.path === "/research" ? "active" : ""].join(" ").trim()}"><a sveltekit:prefetch href="${"/research"}" class="${"svelte-1l7wntg"}">UGent Research</a></li>
                    <li class="${["svelte-1l7wntg", $page.path === "/about_us" ? "active" : ""].join(" ").trim()}"><a sveltekit:prefetch href="${"/about_us"}" class="${"svelte-1l7wntg"}">About Us</a></li></ul>
                
                <a class="${"uk-navbar-toggle uk-hidden@m"}" href="${"#offcanvas"}" uk-toggle style="${"font-size:25px; font-weight:300;"}">\u2261</a></div></nav>


        <div class="${"uk-child-width-1-1@s uk-grid-collapse uk-text-left"}" uk-grid><div><div class="${"uk-position-relative uk-visible-toggle"}" tabindex="${"-1"}" uk-slideshow="${"autoplay: true; autoplay-interval: 4500; pause-on-hover: true;"}"><ul class="${"uk-slideshow-items uk-margin-xlarge-top uk-padding-large-top"}">
                        <li><div class="${"uk-position-center uk-position-small uk-text-center"}"><p class="${"uk-margin-remove quote svelte-1l7wntg"}">&quot;The views were just magnificent as the windows were really large.&quot;</p></div></li>
                        <li><div class="${"uk-position-center uk-position-small uk-text-center"}"><p class="${"uk-margin-remove quote svelte-1l7wntg"}">&quot;The best experience was waking up on the flixbus in the morning, looking at the Swedish landscape and hoping to spot an elk!&quot;</p></div></li>
                        <li><div class="${"uk-position-center uk-position-small uk-text-center"}"><p class="${"uk-margin-remove quote svelte-1l7wntg"}">&quot;Slow traveling on the cargo ship with plenty of time to talk, read, work and rest along the way.&quot;</p></div></li>
                        <li><div class="${"uk-position-center uk-position-small uk-text-center"}"><p class="${"uk-margin-remove quote svelte-1l7wntg"}">&quot;I usually get really a lot of work done during long train trips!&quot;</p></div></li></ul>
        
                    <a class="${"uk-position-center-left uk-position-small uk-hidden-hover"}" style="${"color:#d1d1d1;"}" href="${"#"}" uk-slidenav-previous uk-slideshow-item="${"previous"}"></a>
                    <a class="${"uk-position-center-right uk-position-small uk-hidden-hover"}" style="${"color:#d1d1d1;"}" href="${"#"}" uk-slidenav-next uk-slideshow-item="${"next"}"></a></div></div></div></div>
</div>`;
});
var css$7 = {
  code: ".uk-navbar-nav.svelte-12cby6h>li.svelte-12cby6h>a.svelte-12cby6h{color:rgb(79, 79, 79)}.uk-navbar-nav.svelte-12cby6h>li.svelte-12cby6h:hover>a.svelte-12cby6h,.uk-navbar-nav.svelte-12cby6h>li.svelte-12cby6h>a.svelte-12cby6h:focus{color:#005599}span.svelte-12cby6h.svelte-12cby6h.svelte-12cby6h{display:inline-block;margin-right:-3px}",
  map: `{"version":3,"file":"navbar.svelte","sources":["navbar.svelte"],"sourcesContent":["<script>\\n    \\timport { page } from '$app/stores';\\n<\/script>\\n\\n<!-- uk-sticky=\\"animation: uk-animation-slide-top; sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky uk-light; cls-inactive: uk-navbar-transparent; top: 200\\" -->\\n\\n<nav class=\\"uk-navbar uk-navbar-transparent\\">\\n    <div class=\\"uk-navbar-center\\">\\n        <div class = \\"uk-navbar-item\\"> \\n        <span style = \\"font-size:20px; font-weight:100;\\"> Academic </span>\\n        <span style = \\"font-size:20px; font-weight:300;\\">Travel</span>\\n        </div>   \\n    </div>\\n\\n    <div class=\\"uk-navbar-left\\">\\n        <ul class=\\"uk-navbar-nav uk-visible@m\\">\\n            <li class:active={$page.path === '/'}><a sveltekit:prefetch href=\\"/\\">Home</a></li>\\n            <li class:active={$page.path === '/map'}><a sveltekit:prefetch href=\\"/map\\">Map</a></li>\\n            <li class:active={$page.path === '/stories'}><a sveltekit:prefetch href=\\"/stories\\">Community stories</a></li>\\n        </ul>\\n\\n        <div class=\\"uk-navbar-item uk-visible@m\\">\\n        </div>\\n    </div>\\n\\n    <div class=\\"uk-navbar-right\\">\\n        <ul class=\\"uk-navbar-nav uk-visible@m\\">\\n            <li class:active={$page.path === '/faqs'}><a sveltekit:prefetch href=\\"/faqs\\">FAQ</a></li>\\n            <li class:active={$page.path === '/research'}><a sveltekit:prefetch href=\\"/research\\">UGent Research</a></li>\\n            <li class:active={$page.path === '/about_us'}><a sveltekit:prefetch href=\\"/about_us\\">About Us</a></li>\\n        </ul>\\n        <!-- svelte-ignore a11y-missing-content -->\\n        <a class=\\"uk-navbar-toggle uk-hidden@m\\" href=\\"#offcanvas\\" uk-toggle style = \\"font-size:25px; font-weight:300;\\">\u2261</a>\\n    </div>\\n</nav>\\n\\n<style>\\n\\n.uk-navbar-nav > li > a {\\n    color:rgb(79, 79, 79);\\n}\\n\\n.uk-navbar-nav > li:hover > a,\\n.uk-navbar-nav > li > a:focus,\\n.uk-navbar-nav > li.uk-open > a {\\n    color: #005599;\\n}\\n\\nspan{\\n    display: inline-block;\\n    margin-right: -3px;\\n}\\n\\n</style>"],"names":[],"mappings":"AAsCA,6BAAc,CAAG,iBAAE,CAAG,CAAC,eAAC,CAAC,AACrB,MAAM,IAAI,EAAE,CAAC,CAAC,EAAE,CAAC,CAAC,EAAE,CAAC,AACzB,CAAC,AAED,6BAAc,CAAG,iBAAE,MAAM,CAAG,gBAAC,CAC7B,6BAAc,CAAG,iBAAE,CAAG,gBAAC,MAAM,AACG,CAAC,AAC7B,KAAK,CAAE,OAAO,AAClB,CAAC,AAED,iDAAI,CAAC,AACD,OAAO,CAAE,YAAY,CACrB,YAAY,CAAE,IAAI,AACtB,CAAC"}`
};
var Navbar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$result.css.add(css$7);
  $$unsubscribe_page();
  return `

<nav class="${"uk-navbar uk-navbar-transparent"}"><div class="${"uk-navbar-center"}"><div class="${"uk-navbar-item"}"><span style="${"font-size:20px; font-weight:100;"}" class="${"svelte-12cby6h"}">Academic </span>
        <span style="${"font-size:20px; font-weight:300;"}" class="${"svelte-12cby6h"}">Travel</span></div></div>

    <div class="${"uk-navbar-left"}"><ul class="${"uk-navbar-nav uk-visible@m svelte-12cby6h"}"><li class="${["svelte-12cby6h", $page.path === "/" ? "active" : ""].join(" ").trim()}"><a sveltekit:prefetch href="${"/"}" class="${"svelte-12cby6h"}">Home</a></li>
            <li class="${["svelte-12cby6h", $page.path === "/map" ? "active" : ""].join(" ").trim()}"><a sveltekit:prefetch href="${"/map"}" class="${"svelte-12cby6h"}">Map</a></li>
            <li class="${["svelte-12cby6h", $page.path === "/stories" ? "active" : ""].join(" ").trim()}"><a sveltekit:prefetch href="${"/stories"}" class="${"svelte-12cby6h"}">Community stories</a></li></ul>

        <div class="${"uk-navbar-item uk-visible@m"}"></div></div>

    <div class="${"uk-navbar-right"}"><ul class="${"uk-navbar-nav uk-visible@m svelte-12cby6h"}"><li class="${["svelte-12cby6h", $page.path === "/faqs" ? "active" : ""].join(" ").trim()}"><a sveltekit:prefetch href="${"/faqs"}" class="${"svelte-12cby6h"}">FAQ</a></li>
            <li class="${["svelte-12cby6h", $page.path === "/research" ? "active" : ""].join(" ").trim()}"><a sveltekit:prefetch href="${"/research"}" class="${"svelte-12cby6h"}">UGent Research</a></li>
            <li class="${["svelte-12cby6h", $page.path === "/about_us" ? "active" : ""].join(" ").trim()}"><a sveltekit:prefetch href="${"/about_us"}" class="${"svelte-12cby6h"}">About Us</a></li></ul>
        
        <a class="${"uk-navbar-toggle uk-hidden@m"}" href="${"#offcanvas"}" uk-toggle style="${"font-size:25px; font-weight:300;"}">\u2261</a></div>
</nav>`;
});
var css$6 = {
  code: ".spinner.svelte-40jcyt.svelte-40jcyt{animation:svelte-40jcyt-rotate var(--speed) linear infinite;-webkit-animation:svelte-40jcyt-rotate var(--speed) linear infinite;z-index:2;position:absolute;top:50%;left:50%;margin:-35px 0 0 -35px;width:70px;height:70px}.spinner.svelte-40jcyt .path.svelte-40jcyt{stroke:red;stroke-linecap:round;animation:svelte-40jcyt-dash calc(var(--speed) / 1.33) ease-in-out infinite;-webkit-animation:svelte-40jcyt-dash calc(var(--speed) / 1.33) ease-in-out infinite}@keyframes svelte-40jcyt-rotate{100%{transform:rotate(360deg)}}@keyframes svelte-40jcyt-dash{0%{stroke-dasharray:1, 150;stroke-dashoffset:0}50%{stroke-dasharray:90, 150;stroke-dashoffset:-35}100%{stroke-dasharray:90, 150;stroke-dashoffset:-124}}",
  map: '{"version":3,"file":"SpinNew.svelte","sources":["SpinNew.svelte"],"sourcesContent":["<script>\\n    let size = 50,\\n        thickness = 3,\\n        speed = 2000;\\n<\/script>\\n\\n<svg class=\\"spinner\\" viewBox=\\"0 0 50 50\\" width={size} height={size} style=\\"--speed: {speed}ms\\">\\n    <circle class=\\"path\\" cx=\\"25\\" cy=\\"25\\" r=\\"20\\" fill=\\"none\\" stroke-width={thickness} />\\n</svg>\\n\\n<style>\\n\\t.spinner {\\n\\t\\tanimation: rotate var(--speed) linear infinite;\\n\\t\\t-webkit-animation: rotate var(--speed) linear infinite;\\n\\t\\tz-index: 2;\\n\\t\\tposition: absolute;\\n\\t\\ttop: 50%;\\n\\t\\tleft: 50%;\\n\\t\\tmargin: -35px 0 0 -35px;\\n\\t\\twidth: 70px;\\n\\t\\theight: 70px;\\n\\t}\\n\\n\\t.spinner .path {\\n/* \\t\\tstroke: hsl(210, 70, 75); */\\n\\t\\tstroke: red;\\n\\t\\tstroke-linecap: round;\\n\\t\\tanimation: dash calc(var(--speed) / 1.33) ease-in-out infinite;\\n\\t\\t-webkit-animation: dash calc(var(--speed) / 1.33) ease-in-out infinite;\\n\\t}\\n\\n\\n\\t@keyframes rotate {\\n\\t\\t100% {\\n\\t\\t\\ttransform: rotate(360deg);\\n\\t\\t}\\n\\t}\\n\\n\\t@keyframes dash {\\n\\t\\t0% {\\n\\t\\t\\tstroke-dasharray: 1, 150;\\n\\t\\t\\tstroke-dashoffset: 0;\\n\\t\\t}\\n\\t\\t50% {\\n\\t\\t\\tstroke-dasharray: 90, 150;\\n\\t\\t\\tstroke-dashoffset: -35;\\n\\t\\t}\\n\\t\\t100% {\\n\\t\\t\\tstroke-dasharray: 90, 150;\\n\\t\\t\\tstroke-dashoffset: -124;\\n\\t\\t}\\n\\t}\\n</style>\\n\\n"],"names":[],"mappings":"AAWC,QAAQ,4BAAC,CAAC,AACT,SAAS,CAAE,oBAAM,CAAC,IAAI,OAAO,CAAC,CAAC,MAAM,CAAC,QAAQ,CAC9C,iBAAiB,CAAE,oBAAM,CAAC,IAAI,OAAO,CAAC,CAAC,MAAM,CAAC,QAAQ,CACtD,OAAO,CAAE,CAAC,CACV,QAAQ,CAAE,QAAQ,CAClB,GAAG,CAAE,GAAG,CACR,IAAI,CAAE,GAAG,CACT,MAAM,CAAE,KAAK,CAAC,CAAC,CAAC,CAAC,CAAC,KAAK,CACvB,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,IAAI,AACb,CAAC,AAED,sBAAQ,CAAC,KAAK,cAAC,CAAC,AAEf,MAAM,CAAE,GAAG,CACX,cAAc,CAAE,KAAK,CACrB,SAAS,CAAE,kBAAI,CAAC,KAAK,IAAI,OAAO,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAAC,WAAW,CAAC,QAAQ,CAC9D,iBAAiB,CAAE,kBAAI,CAAC,KAAK,IAAI,OAAO,CAAC,CAAC,CAAC,CAAC,IAAI,CAAC,CAAC,WAAW,CAAC,QAAQ,AACvE,CAAC,AAGD,WAAW,oBAAO,CAAC,AAClB,IAAI,AAAC,CAAC,AACL,SAAS,CAAE,OAAO,MAAM,CAAC,AAC1B,CAAC,AACF,CAAC,AAED,WAAW,kBAAK,CAAC,AAChB,EAAE,AAAC,CAAC,AACH,gBAAgB,CAAE,CAAC,CAAC,CAAC,GAAG,CACxB,iBAAiB,CAAE,CAAC,AACrB,CAAC,AACD,GAAG,AAAC,CAAC,AACJ,gBAAgB,CAAE,EAAE,CAAC,CAAC,GAAG,CACzB,iBAAiB,CAAE,GAAG,AACvB,CAAC,AACD,IAAI,AAAC,CAAC,AACL,gBAAgB,CAAE,EAAE,CAAC,CAAC,GAAG,CACzB,iBAAiB,CAAE,IAAI,AACxB,CAAC,AACF,CAAC"}'
};
var size = 50;
var thickness = 3;
var speed = 2e3;
var SpinNew = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$6);
  return `<svg class="${"spinner svelte-40jcyt"}" viewBox="${"0 0 50 50"}"${add_attribute("width", size, 0)}${add_attribute("height", size, 0)} style="${"--speed: " + escape2(speed) + "ms"}"><circle class="${"path svelte-40jcyt"}" cx="${"25"}" cy="${"25"}" r="${"20"}" fill="${"none"}"${add_attribute("stroke-width", thickness, 0)}></circle></svg>`;
});
var Map$2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<object type="${"text/html"}" data="${"https://academictravel.ugent.be/shiny/academictravel/"}" style="${"overflow:auto; width:100%; height:100vh;"}"></object>`;
});
var css$5 = {
  code: ".uk-navbar-nav.svelte-f4v9bq>li.svelte-f4v9bq>a.svelte-f4v9bq{color:rgb(79, 79, 79)}.uk-navbar-nav.svelte-f4v9bq>li.svelte-f4v9bq:hover>a.svelte-f4v9bq,.uk-navbar-nav.svelte-f4v9bq>li.svelte-f4v9bq>a.svelte-f4v9bq:focus{color:#005599}span.svelte-f4v9bq.svelte-f4v9bq.svelte-f4v9bq{display:inline-block;margin-right:-3px}",
  map: `{"version":3,"file":"navbar_map.svelte","sources":["navbar_map.svelte"],"sourcesContent":["<script>\\n    \\timport { page } from '$app/stores';\\n        import SpinNew from '/src/lib/SpinNew.svelte'\\n        import Map from './map.svelte'\\n\\n<\/script>\\n\\n<div class=\\"uk-position-relative\\">\\n    <!-- svelte-ignore a11y-missing-attribute -->\\n    <Map>\\n        <span slot=\\"loader\\">\\n            <SpinNew />\\n        </span>\\n    </Map>\\n    <div class=\\"uk-position-top\\">\\n        \\n        \\n        <nav class=\\"uk-navbar uk-navbar-transparent\\">\\n            <div class=\\"uk-navbar-center\\">\\n                <div class = \\"uk-navbar-item\\"> \\n                <span style = \\"font-size:20px; font-weight:100;\\"> Academic </span>\\n                <span style = \\"font-size:20px; font-weight:300;\\">Travel</span>\\n                </div>   \\n            </div>\\n\\n            <div class=\\"uk-navbar-left\\">\\n                <ul class=\\"uk-navbar-nav uk-visible@m\\">\\n                    <li class:active={$page.path === '/'}><a sveltekit:prefetch href=\\"/\\">Home</a></li>\\n                    <li class:active={$page.path === '/map'}><a sveltekit:prefetch href=\\"/map\\">Map</a></li>\\n                    <li class:active={$page.path === '/stories'}><a sveltekit:prefetch href=\\"/stories\\">Community stories</a></li>\\n                </ul>\\n\\n                <div class=\\"uk-navbar-item uk-visible@m\\">\\n                </div>\\n            </div>\\n\\n            <div class=\\"uk-navbar-right\\">\\n                <ul class=\\"uk-navbar-nav uk-visible@m\\">\\n                    <li class:active={$page.path === '/faqs'}><a sveltekit:prefetch href=\\"/faqs\\">FAQ</a></li>\\n                    <li class:active={$page.path === '/research'}><a sveltekit:prefetch href=\\"/research\\">UGent Research</a></li>\\n                    <li class:active={$page.path === '/about_us'}><a sveltekit:prefetch href=\\"/about_us\\">About Us</a></li>\\n                </ul>\\n                <!-- svelte-ignore a11y-missing-content -->\\n                <a class=\\"uk-navbar-toggle uk-hidden@m\\" href=\\"#offcanvas\\" uk-toggle style = \\"font-size:25px; font-weight:300;\\">\u2261</a>\\n            </div>\\n        </nav>\\n\\n</div>\\n</div>\\n\\n<style>\\n/*.uk-navbar-container:not(.uk-navbar-transparent) {\\n\\tbackground: rgb(79, 79, 79);\\n}*/\\n\\n.uk-navbar-nav > li > a {\\n    color:rgb(79, 79, 79);\\n}\\n\\n.uk-navbar-nav > li:hover > a,\\n.uk-navbar-nav > li > a:focus,\\n.uk-navbar-nav > li.uk-open > a {\\n    color: #005599;\\n}\\n\\nspan{\\n    display: inline-block;\\n    margin-right: -3px;\\n}\\n\\n</style>"],"names":[],"mappings":"AAuDA,4BAAc,CAAG,gBAAE,CAAG,CAAC,cAAC,CAAC,AACrB,MAAM,IAAI,EAAE,CAAC,CAAC,EAAE,CAAC,CAAC,EAAE,CAAC,AACzB,CAAC,AAED,4BAAc,CAAG,gBAAE,MAAM,CAAG,eAAC,CAC7B,4BAAc,CAAG,gBAAE,CAAG,eAAC,MAAM,AACG,CAAC,AAC7B,KAAK,CAAE,OAAO,AAClB,CAAC,AAED,8CAAI,CAAC,AACD,OAAO,CAAE,YAAY,CACrB,YAAY,CAAE,IAAI,AACtB,CAAC"}`
};
var Navbar_map = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$result.css.add(css$5);
  $$unsubscribe_page();
  return `<div class="${"uk-position-relative"}">
    ${validate_component(Map$2, "Map").$$render($$result, {}, {}, {
    loader: () => `<span slot="${"loader"}" class="${"svelte-f4v9bq"}">${validate_component(SpinNew, "SpinNew").$$render($$result, {}, {}, {})}</span>`
  })}
    <div class="${"uk-position-top"}"><nav class="${"uk-navbar uk-navbar-transparent"}"><div class="${"uk-navbar-center"}"><div class="${"uk-navbar-item"}"><span style="${"font-size:20px; font-weight:100;"}" class="${"svelte-f4v9bq"}">Academic </span>
                <span style="${"font-size:20px; font-weight:300;"}" class="${"svelte-f4v9bq"}">Travel</span></div></div>

            <div class="${"uk-navbar-left"}"><ul class="${"uk-navbar-nav uk-visible@m svelte-f4v9bq"}"><li class="${["svelte-f4v9bq", $page.path === "/" ? "active" : ""].join(" ").trim()}"><a sveltekit:prefetch href="${"/"}" class="${"svelte-f4v9bq"}">Home</a></li>
                    <li class="${["svelte-f4v9bq", $page.path === "/map" ? "active" : ""].join(" ").trim()}"><a sveltekit:prefetch href="${"/map"}" class="${"svelte-f4v9bq"}">Map</a></li>
                    <li class="${["svelte-f4v9bq", $page.path === "/stories" ? "active" : ""].join(" ").trim()}"><a sveltekit:prefetch href="${"/stories"}" class="${"svelte-f4v9bq"}">Community stories</a></li></ul>

                <div class="${"uk-navbar-item uk-visible@m"}"></div></div>

            <div class="${"uk-navbar-right"}"><ul class="${"uk-navbar-nav uk-visible@m svelte-f4v9bq"}"><li class="${["svelte-f4v9bq", $page.path === "/faqs" ? "active" : ""].join(" ").trim()}"><a sveltekit:prefetch href="${"/faqs"}" class="${"svelte-f4v9bq"}">FAQ</a></li>
                    <li class="${["svelte-f4v9bq", $page.path === "/research" ? "active" : ""].join(" ").trim()}"><a sveltekit:prefetch href="${"/research"}" class="${"svelte-f4v9bq"}">UGent Research</a></li>
                    <li class="${["svelte-f4v9bq", $page.path === "/about_us" ? "active" : ""].join(" ").trim()}"><a sveltekit:prefetch href="${"/about_us"}" class="${"svelte-f4v9bq"}">About Us</a></li></ul>
                
                <a class="${"uk-navbar-toggle uk-hidden@m"}" href="${"#offcanvas"}" uk-toggle style="${"font-size:25px; font-weight:300;"}">\u2261</a></div></nav></div>
</div>`;
});
var logoUgent = "/_app/assets/logo_ugent.ccd6922d.png";
var css$4 = {
  code: "main.svelte-8c0ziu{font-family:'Roboto';flex:1;display:flex;flex-direction:column;padding:0;width:100%;margin:0 auto;box-sizing:border-box;background:#f5f5f5}footer.svelte-8c0ziu{display:flex;flex-direction:column;justify-content:right;align-items:middle;background:#f5f5f5;height:auto}a.svelte-8c0ziu{color:#1e87f0}a.svelte-8c0ziu:hover{color:tomato}@media(min-width: 480px){footer.svelte-8c0ziu{padding:0px 0}}",
  map: `{"version":3,"file":"__layout.svelte","sources":["__layout.svelte"],"sourcesContent":["<script>\\n\\timport { page } from '$app/stores';\\n\\timport NavbarHome from '/src/lib/navbar_home/navbar_home.svelte';\\n\\timport Navbar from '/src/lib/navbar/navbar.svelte';\\n\\timport NavbarMap from '/src/lib/navbar_map/navbar_map.svelte';\\n\\timport '../app.css';\\n\\timport '@fontsource/roboto';\\n\\timport logoUgent from '/static/pictures/logo_ugent.png'\\n\\n<\/script>\\n\\n{#if $page.path === '/'}\\n<NavbarHome />\\n{/if}\\n{#if $page.path === '/map'}\\n<NavbarMap />\\n{/if}\\n{#if $page.path !== '/' && $page.path !== '/map'}\\n<Navbar />\\n{/if}\\n\\n\\n\\n<main>\\n\\t<slot />\\n</main>\\n\\n<footer>\\n\\t<div class=\\"uk-child-width-1-3@m uk-text-center uk-flex-middle uk-grid-small uk-margin-remove uk-padding-remove\\" uk-grid>\\n\\t\\t\\n\\t\\t<div>\\n\\t\\t\\t<span class =\\"uk-align-left\\" style = \\"display: inline; text-decoration:none; font-size:14px; font-family:Helvetica; font-weight:100;\\">\\n\\t\\t\\t\\tDesigned and developed by <b>Filipe Teixeira</b> &nbsp; </span>\\n\\t\\t</div>\\n\\n\\t\\t<div class= \\"uk-margin-remove uk-padding-remove\\">\\n\\t\\t\\t<!--<p class= \\"uk-margin-small uk-padding-remove\\" style = \\"display: block; text-decoration:none; font-size:12px; font-family:Helvetica; font-weight:100;\\">Follow me</p>-->\\n\\t\\t\\t<a href=\\"https://github.com/FilipeamTeixeira\\" target=\\"_blank\\">\\n\\t\\t\\t\\t<span uk-icon=\\"icon: github; ratio: 1.2\\" class = \\"uk-icon-link\\"></span>\\n\\t\\t\\t</a>\\n\\t\\t\\t<span>&nbsp;</span>\\n\\t\\t\\t\\t<a href=\\"https://twitter.com/filipeabroad\\" target=\\"_blank\\">\\n\\t\\t\\t\\t\\t<span uk-icon=\\"icon: twitter; ratio: 1.2\\" class = \\"uk-icon-link\\"></span>\\n\\t\\t\\t</a>\\n\\t\\t</div>\\n\\n\\n\\n\\t\\t<div>\\n\\t\\t\\t<img class = \\"uk-align-right\\" src={logoUgent} alt=\\"\\" height=\\"80\\" width=\\"80\\" />\\n\\t\\t</div>\\n\\n\\t</div>\\n\\n</footer>\\n\\n\\n\\n<div id=\\"offcanvas\\" uk-offcanvas=\\"mode: push; overlay: true\\">\\n    <div class=\\"uk-offcanvas-bar\\">\\n        <div class=\\"uk-panel\\">\\n            <ul class=\\"uk-nav uk-nav-default tm-nav\\">\\n                <li class:active={$page.path === '/'}><a sveltekit:prefetch href=\\"/\\">Home</a></li>\\n                <li class:active={$page.path === '/map'}><a sveltekit:prefetch href=\\"/map\\">Map</a></li>\\n                <li class:active={$page.path === '/stories'}><a sveltekit:prefetch href=\\"/stories\\">Community stories</a></li>\\n                <li class:active={$page.path === '/faqs'}><a sveltekit:prefetch href=\\"/faqs\\">FAQ</a></li>\\n                <li class:active={$page.path === '/research'}><a sveltekit:prefetch href=\\"/research\\">UGent Research</a></li>\\n                <li class:active={$page.path === '/about_us'}><a sveltekit:prefetch href=\\"/about_us\\">About Us</a></li>\\n             </ul>\\n        </div>\\n    </div>\\n</div>\\n\\n\\n<style>\\n\\n\\tmain {\\n\\t\\tfont-family: 'Roboto';\\n\\t\\tflex: 1;\\n\\t\\tdisplay: flex;\\n\\t\\tflex-direction: column;\\n\\t\\tpadding: 0;\\n\\t\\twidth: 100%;\\n\\t\\tmargin: 0 auto;\\n\\t\\tbox-sizing: border-box;\\n\\t\\tbackground: #f5f5f5;\\n\\t}\\n\\n\\tfooter {\\n\\t\\tdisplay: flex;\\n\\t\\tflex-direction: column;\\n\\t\\tjustify-content: right;\\n\\t\\talign-items: middle;\\n\\t\\tbackground: #f5f5f5;\\n\\t\\theight: auto;\\n\\t}\\n\\n\\ta{\\n\\t\\tcolor: #1e87f0;\\n\\t}\\n\\n\\ta:hover { \\n  \\t\\tcolor:tomato;\\n\\t}\\n/*\\tfooter a {\\n\\t\\tfont-weight: bold;\\n\\t}\\n*/\\n\\n\\t@media (min-width: 480px) {\\n\\t\\tfooter {\\n\\t\\t\\tpadding: 0px 0;\\n\\t\\t}\\n\\t}\\n\\n</style>\\n"],"names":[],"mappings":"AA4EC,IAAI,cAAC,CAAC,AACL,WAAW,CAAE,QAAQ,CACrB,IAAI,CAAE,CAAC,CACP,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,OAAO,CAAE,CAAC,CACV,KAAK,CAAE,IAAI,CACX,MAAM,CAAE,CAAC,CAAC,IAAI,CACd,UAAU,CAAE,UAAU,CACtB,UAAU,CAAE,OAAO,AACpB,CAAC,AAED,MAAM,cAAC,CAAC,AACP,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,eAAe,CAAE,KAAK,CACtB,WAAW,CAAE,MAAM,CACnB,UAAU,CAAE,OAAO,CACnB,MAAM,CAAE,IAAI,AACb,CAAC,AAED,eAAC,CAAC,AACD,KAAK,CAAE,OAAO,AACf,CAAC,AAED,eAAC,MAAM,AAAC,CAAC,AACN,MAAM,MAAM,AACf,CAAC,AAMD,MAAM,AAAC,YAAY,KAAK,CAAC,AAAC,CAAC,AAC1B,MAAM,cAAC,CAAC,AACP,OAAO,CAAE,GAAG,CAAC,CAAC,AACf,CAAC,AACF,CAAC"}`
};
var _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$result.css.add(css$4);
  $$unsubscribe_page();
  return `${$page.path === "/" ? `${validate_component(Navbar_home, "NavbarHome").$$render($$result, {}, {}, {})}` : ``}
${$page.path === "/map" ? `${validate_component(Navbar_map, "NavbarMap").$$render($$result, {}, {}, {})}` : ``}
${$page.path !== "/" && $page.path !== "/map" ? `${validate_component(Navbar, "Navbar").$$render($$result, {}, {}, {})}` : ``}



<main class="${"svelte-8c0ziu"}">${slots.default ? slots.default({}) : ``}</main>

<footer class="${"svelte-8c0ziu"}"><div class="${"uk-child-width-1-3@m uk-text-center uk-flex-middle uk-grid-small uk-margin-remove uk-padding-remove"}" uk-grid><div><span class="${"uk-align-left"}" style="${"display: inline; text-decoration:none; font-size:14px; font-family:Helvetica; font-weight:100;"}">Designed and developed by <b>Filipe Teixeira</b> \xA0 </span></div>

		<div class="${"uk-margin-remove uk-padding-remove"}">
			<a href="${"https://github.com/FilipeamTeixeira"}" target="${"_blank"}" class="${"svelte-8c0ziu"}"><span uk-icon="${"icon: github; ratio: 1.2"}" class="${"uk-icon-link"}"></span></a>
			<span>\xA0</span>
				<a href="${"https://twitter.com/filipeabroad"}" target="${"_blank"}" class="${"svelte-8c0ziu"}"><span uk-icon="${"icon: twitter; ratio: 1.2"}" class="${"uk-icon-link"}"></span></a></div>



		<div><img class="${"uk-align-right"}"${add_attribute("src", logoUgent, 0)} alt="${""}" height="${"80"}" width="${"80"}"></div></div></footer>



<div id="${"offcanvas"}" uk-offcanvas="${"mode: push; overlay: true"}"><div class="${"uk-offcanvas-bar"}"><div class="${"uk-panel"}"><ul class="${"uk-nav uk-nav-default tm-nav"}"><li${add_classes([$page.path === "/" ? "active" : ""].join(" ").trim())}><a sveltekit:prefetch href="${"/"}" class="${"svelte-8c0ziu"}">Home</a></li>
                <li${add_classes([$page.path === "/map" ? "active" : ""].join(" ").trim())}><a sveltekit:prefetch href="${"/map"}" class="${"svelte-8c0ziu"}">Map</a></li>
                <li${add_classes([$page.path === "/stories" ? "active" : ""].join(" ").trim())}><a sveltekit:prefetch href="${"/stories"}" class="${"svelte-8c0ziu"}">Community stories</a></li>
                <li${add_classes([$page.path === "/faqs" ? "active" : ""].join(" ").trim())}><a sveltekit:prefetch href="${"/faqs"}" class="${"svelte-8c0ziu"}">FAQ</a></li>
                <li${add_classes([$page.path === "/research" ? "active" : ""].join(" ").trim())}><a sveltekit:prefetch href="${"/research"}" class="${"svelte-8c0ziu"}">UGent Research</a></li>
                <li${add_classes([$page.path === "/about_us" ? "active" : ""].join(" ").trim())}><a sveltekit:prefetch href="${"/about_us"}" class="${"svelte-8c0ziu"}">About Us</a></li></ul></div></div>
</div>`;
});
var __layout = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": _layout
});
function load({ error: error22, status }) {
  return { props: { error: error22, status } };
}
var Error$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { status } = $$props;
  let { error: error22 } = $$props;
  if ($$props.status === void 0 && $$bindings.status && status !== void 0)
    $$bindings.status(status);
  if ($$props.error === void 0 && $$bindings.error && error22 !== void 0)
    $$bindings.error(error22);
  return `<h1>${escape2(status)}</h1>

<pre>${escape2(error22.message)}</pre>



${error22.frame ? `<pre>${escape2(error22.frame)}</pre>` : ``}
${error22.stack ? `<pre>${escape2(error22.stack)}</pre>` : ``}`;
});
var error2 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Error$1,
  load
});
var banner = "/_app/assets/banner.e3399a8e.jpg";
var prerender$6 = true;
var Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `${$$result.title = `<title>Home</title>`, ""}`, ""}

<div class="${"uk-child-width-1-1@s uk-grid-collapse uk-text-left"}" uk-grid><div><div class="${"uk-tile"}"></div></div></div>


<div class="${"uk-section uk-section-small"}" style="${"background-color:#0076b6;"}"><div class="${"uk-card uk-card-body uk-align-center uk-text-justify"}"><h3 class="${"uk-card-title uk-light"}">Sustainable travel policy</h3>
        
            <p class="${"uk-light"}" style="${"font-family:Helvetica; font-weight:100;"}">De UGent engageert zich om minder, doordachter en duurzamer te vliegen en zo de CO2-uitstoot van haar vliegreizen tegen 2030 met minstens 1/3de te reduceren t.o.v. 2019.
                Meer informatie: <a href="${"http://www.ugent.be/reisbeleid"}" target="${"_blank"}">http://www.ugent.be/reisbeleid</a></p>
        
            <p class="${"uk-light"}" style="${"font-family:Helvetica; font-weight:100;"}">Ghent University commits itself to fly less, more thoughtfully and more sustainably, and thus to reduce the CO2 emissions of its air travel by at least 1/3rd by 2030 compared to 2019.
                More information: <a href="${"http://www.ugent.be/travelpolicy"}" target="${"_blank"}">www.ugent.be/travelpolicy</a></p>
            <hr class="${"uk-grid-divider uk-margin-left uk-margin-right uk-margin-medium-top uk-light"}">
            <h3 class="${"uk-card-title uk-light"}">Help us build this tool</h3>

            <p class="${"uk-light"}" style="${"font-family:Helvetica; font-weight:100;"}">Some of the maps that are displayed on this website were developed by crowdsourcing information from the UGent community. By means of a survey, we ask for information about one particular sustainable UGent-related trip: how did you travel? How about travel expenses? Did you take any transfers? How was the comfort like? Did you enjoy your trip? Etc. By consolidating this input into interactive maps, you easily get a sense of where and how UGent colleagues have traveled and how they experienced their trips. More detailed stories can be consulted in the \u2018Community stories\u2019 tab page on this website. Take a look at the growing pool of examples \u2013 and get inspired! Do you want to help us build these maps? Did you travel sustainably for UGent-related purposes? Please fill in this 
                <a href="${"https://www.enquete.ugent.be/survey322/index.php/676424?lang=en"}" target="${"_blank"}">survey</a>! We would love to hear from you.
            </p></div></div>

    <div class="${"uk-height-medium uk-flex uk-flex-center uk-flex-middle uk-background-cover"}"${add_attribute("data-src", banner, 0)} uk-img></div>`;
});
var index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Routes,
  prerender: prerender$6
});
var stories$1 = [
  {
    first_name: "Hans",
    last_name: "Verbeeck",
    bio: "Professor vakgroep Omgeving aan de faculteit Bio-ingenieurswetenschappen",
    storyA: "Ik ga jaarlijks naar de \u2018European Geophysical Union Conference\u2019 in Wenen. Een 10-jaar geleden ben ik overgeschakeld van het vliegtuig naar de trein. Met de nachttrein uit Keulen geraak je vlot in Wenen, en sinds kort is er ook een nachttrein rechtstreeks uit Brussel. Je stapt om 19u30 op de trein in Brussel en iets na 9u de volgende ochtend stap je uit in het centrum van Wenen. Soms, als dit beter uitkomt, neem ik de trein overdag naar Wenen. Dit gaat sneller (11 uur reistijd) en je kan de hele dag comfortabel werken op de Duitse ICE treinen. Sowieso doe ik alle dienstreizen naar onze buurlanden met de trein, zelfs naar het Noorden van Engeland of het Zuiden van Frankrijk.",
    storyB: "Boek je treinen richting het Oosten (Duitsland, Oostenrijk, Polen, Tsjechi\xEB) via Deutsche Bahn. Dit is vaak goedkoper en geeft meestal meer opties dan de NMBS.\nAls je voor het eerst een lange treinreis zelf boekt, is het vaak even zoeken, maar het is een kwestie van gewoonte. En als je je een vliegreis in de weegschaal legt t.o.v. de trein moet je de hele reis in beschouwing nemen (reisduur van deur tot deur), het comfort en het uitzicht!",
    storyC: "",
    picture: "profile-picture-hans-verbeeck.png",
    date: " 2021-08-26",
    id: "hans_verbeeck",
    id_code: 1,
    color: "#675864"
  }
];
var css$3 = {
  code: "a.svelte-5rli68:hover,a.svelte-5rli68:visited,a.svelte-5rli68:link,a.svelte-5rli68:active{text-decoration:none}.zoom.svelte-5rli68:hover{transform:scale(1.1);z-index:3;position:relative}.uk-card-body.svelte-5rli68{color:rgb(61, 61, 61);font-family:Roboto;font-weight:200;font-size:18px}",
  map: `{"version":3,"file":"stories copy.svelte","sources":["stories copy.svelte"],"sourcesContent":["<script context=\\"module\\">\\n    export const prerender = true;\\n    import stories from \\"/static/json_files/frdata.json\\"\\n\\n<\/script>\\n\\n<div class=\\"uk-position-relative uk-visible-toggle uk-light\\" tabindex=\\"-1\\" uk-slider>\\n\\n<ul class=\\"uk-margin-remove uk-padding-remove uk-slider-items uk-child-width-1-2 uk-child-width-1-3@s uk-child-width-1-4@m\\">\\n    {#each stories as stories}\\n    <li class=\\"zoom uk-transition-toggle uk-animation-toggle\\">\\n\\n    <a href=\\"#{stories.id}\\" uk-toggle>\\n        <div uk-height-viewport=\\"offset-top: true\\" class=\\"uk-card uk-card-body uk-height-medium uk-light\\" style=\\"background-color:{stories.color}\\">\\n                <h1 class = \\"uk-text-left uk-margin-top\\" style = \\"font-weight:600;\\">{stories.first_name} {stories.last_name}</h1>\\n            <p class = \\"uk-text-meta uk-margin-top-medium\\">{stories.bio}</p>\\n            <!-- removed class=\\"uk-transition-slide-bottom-small\\"-->\\n            <div class=\\"uk-card-footer uk-position-bottom\\">\\n                <span class = \\"uk-light uk-margin-small-right\\" uk-icon=\\"info\\"></span>\\n                <span class = \\"uk-light\\" style=\\"font-size: 14px;\\">Read story</span>\\n            </div>\\n        </div>\\n    </a>\\n</li>\\n    {/each}\\n</ul>\\n\\n<a class=\\"uk-position-center-left uk-position-small uk-hidden-hover\\" href=\\"#\\" uk-slidenav-previous uk-slider-item=\\"previous\\"></a>\\n<a class=\\"uk-position-center-right uk-position-small uk-hidden-hover\\" href=\\"#\\" uk-slidenav-next uk-slider-item=\\"next\\"></a>\\n\\n</div>\\n\\n<!-- TODO:\\n    1- add id to name in shiny\\n    2- add 3 parts of the story-->\\n\\n{#each stories as stories}\\n<div id={stories.id} class=\\"uk-modal-full\\" uk-modal>\\n    <div class=\\"uk-modal-dialog\\">\\n        <button class=\\"uk-modal-close-full uk-close-large\\" type=\\"button\\" uk-close></button>\\n        <div class=\\"uk-grid-collapse uk-child-width-1-2@s uk-flex-middle\\" uk-grid>\\n<!--            <div class=\\"uk-background-cover\\" style=\\"background-image: url('/static/stories_pics/{stories.picture}');\\" uk-height-viewport></div>\\n            <div class=\\"uk-height-medium uk-flex uk-flex-center uk-flex-middle uk-background-cover\\" data-src = \\"static/stories_pics/{stories.picture}\\" uk-img uk-height-viewport></div>\\n-->\\n            <img src = \\"/stories_pics/{stories.picture}\\" alt=\\"\\">\\n            <div class=\\"uk-padding-large\\">\\n                <h1>{stories.first_name} {stories.last_name}</h1>\\n                <p class = \\"uk-text-meta\\">{stories.bio}</p>\\n                <h1 style = \\"text-align:left; font-size:20px; font-weight:600;\\">Which initiatives have you taken/are you taking?</h1>\\n                <p class = \\"uk-text-justify\\">{stories.storyA}</p>\\n                <h1 style = \\"text-align:left; font-size:20px; font-weight:600;\\">Do you have any tips to convince your colleagues?</h1>\\n                <p class = \\"uk-text-justify\\">{stories.storyB}</p>\\n            </div>\\n        </div>\\n    </div>\\n</div>\\n{/each}\\n\\n\\n<style>\\n\\na:hover, a:visited, a:link, a:active{\\n    text-decoration: none;\\n}\\n\\n.zoom:hover {\\n  transform: scale(1.1);\\n  z-index: 3;\\n  position:relative;\\n} \\n\\n.uk-section{\\n    margin:20px;\\n}\\n.uk-card-body{\\n    color: rgb(61, 61, 61);\\n    font-family: Roboto;\\n    font-weight: 200;\\n    font-size: 18px;\\n}\\n\\n\\n</style>\\n\\n\\n\\n\\n<!--\\n\\n            {#each stories as stories}\\n        <div class=\\"uk-grid-divider uk-child-width-expand@s frontrun\\" uk-grid>\\n\\n    <div>\\n        <div class=\\"uk-card\\">\\n            <div class=\\"uk-card-media-top\\">\\n                <img src = {stories.picture} alt = \\"\\">\\n            </div>\\n            <div class=\\"uk-card-body\\">\\n                <h3 class=\\"uk-card-title\\">{stories.name}</h3>\\n                <p>{stories.bio}</p>\\n            </div>\\n        </div>\\n    </div>\\n    <div>\\n        <h3>Story</h3>\\n        <p class = \\"uk-text-justify\\">\\n            {stories.story}\\n        </p>\\n    </div>\\n    </div>\\n    {/each}\\n\\n-->\\n\\n<!--\\n    Colors:\\n    675864\\n    d37861\\n    144a81\\n    d04444\\n    93b3ad\\n    147074\\n    0076b6\\n-->"],"names":[],"mappings":"AA6DA,eAAC,MAAM,CAAE,eAAC,QAAQ,CAAE,eAAC,KAAK,CAAE,eAAC,OAAO,CAAC,AACjC,eAAe,CAAE,IAAI,AACzB,CAAC,AAED,mBAAK,MAAM,AAAC,CAAC,AACX,SAAS,CAAE,MAAM,GAAG,CAAC,CACrB,OAAO,CAAE,CAAC,CACV,SAAS,QAAQ,AACnB,CAAC,AAKD,2BAAa,CAAC,AACV,KAAK,CAAE,IAAI,EAAE,CAAC,CAAC,EAAE,CAAC,CAAC,EAAE,CAAC,CACtB,WAAW,CAAE,MAAM,CACnB,WAAW,CAAE,GAAG,CAChB,SAAS,CAAE,IAAI,AACnB,CAAC"}`
};
var prerender$5 = true;
var Storiesu20copy = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$3);
  return `<div class="${"uk-position-relative uk-visible-toggle uk-light"}" tabindex="${"-1"}" uk-slider><ul class="${"uk-margin-remove uk-padding-remove uk-slider-items uk-child-width-1-2 uk-child-width-1-3@s uk-child-width-1-4@m"}">${each(stories$1, (stories2) => `<li class="${"zoom uk-transition-toggle uk-animation-toggle svelte-5rli68"}"><a href="${"#" + escape2(stories2.id)}" uk-toggle class="${"svelte-5rli68"}"><div uk-height-viewport="${"offset-top: true"}" class="${"uk-card uk-card-body uk-height-medium uk-light svelte-5rli68"}" style="${"background-color:" + escape2(stories2.color)}"><h1 class="${"uk-text-left uk-margin-top"}" style="${"font-weight:600;"}">${escape2(stories2.first_name)} ${escape2(stories2.last_name)}</h1>
            <p class="${"uk-text-meta uk-margin-top-medium"}">${escape2(stories2.bio)}</p>
            
            <div class="${"uk-card-footer uk-position-bottom"}"><span class="${"uk-light uk-margin-small-right"}" uk-icon="${"info"}"></span>
                <span class="${"uk-light"}" style="${"font-size: 14px;"}">Read story</span></div>
        </div></a>
</li>`)}</ul>

<a class="${"uk-position-center-left uk-position-small uk-hidden-hover svelte-5rli68"}" href="${"#"}" uk-slidenav-previous uk-slider-item="${"previous"}"></a>
<a class="${"uk-position-center-right uk-position-small uk-hidden-hover svelte-5rli68"}" href="${"#"}" uk-slidenav-next uk-slider-item="${"next"}"></a></div>



${each(stories$1, (stories2) => `<div${add_attribute("id", stories2.id, 0)} class="${"uk-modal-full"}" uk-modal><div class="${"uk-modal-dialog"}"><button class="${"uk-modal-close-full uk-close-large"}" type="${"button"}" uk-close></button>
        <div class="${"uk-grid-collapse uk-child-width-1-2@s uk-flex-middle"}" uk-grid>
            <img src="${"/stories_pics/" + escape2(stories2.picture)}" alt="${""}">
            <div class="${"uk-padding-large"}"><h1>${escape2(stories2.first_name)} ${escape2(stories2.last_name)}</h1>
                <p class="${"uk-text-meta"}">${escape2(stories2.bio)}</p>
                <h1 style="${"text-align:left; font-size:20px; font-weight:600;"}">Which initiatives have you taken/are you taking?</h1>
                <p class="${"uk-text-justify"}">${escape2(stories2.storyA)}</p>
                <h1 style="${"text-align:left; font-size:20px; font-weight:600;"}">Do you have any tips to convince your colleagues?</h1>
                <p class="${"uk-text-justify"}">${escape2(stories2.storyB)}</p></div>
        </div></div>
</div>`)}









`;
});
var stories_copy = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Storiesu20copy,
  prerender: prerender$5
});
var train3 = "/_app/assets/train3.b9930794.jpg";
var train2 = "/_app/assets/train2.db8f628e.jpg";
var train1 = "/_app/assets/train1.9152a080.jpg";
var css$2 = {
  code: ".function.svelte-2gqjzg{font-weight:100;font-family:Helvetica;font-size:14px}",
  map: `{"version":3,"file":"about_us.svelte","sources":["about_us.svelte"],"sourcesContent":["<script context=\\"module\\">\\n\\texport const prerender = true;\\n\\t\\n\\timport train1 from '/static/pictures/train1.jpg';\\n\\timport train2 from '/static/pictures/train2.jpg';\\n\\timport train3 from '/static/pictures/train3.jpg';\\n\\n<\/script>\\n\\n<svelte:head>\\n\\t<title>About Us</title>\\n</svelte:head>\\n\\n\\n<div class=\\"uk-grid-collapse\\" uk-grid>\\n        <div class=\\"uk-text-justify uk-light uk-card uk-flex uk-flex-center uk-flex-middle uk-width-2-3\\" style=\\"padding: 40px; font-family:Helvetica; font-weight:100; height:270px; background-color: #93b3ad;\\">\\n\\t\\t\\tThis Academic Travel platform is an initiative from the Environmental Department, the Green Office and the Geography Department, all embedded within Ghent University. \\n\\t\\t\\tThe tool was conceptualized and developed in light of the new UGent sustainable travel policy which was rolled out in September 2021. \\n\\t\\t\\tIn its initial stage, 'Academic Travel' aims to serve as a sensitizing and inspirational tool for the community of UGent employees, \\n\\t\\t\\thoping to stimulate the transition towards more sustainable work-related travels. \\n\\t\\t\\tA number of UGent members in particular have dedicated their time into realising this \\n\\t\\t\\ttool and are listed below. We are very keen on receiving any feedback or comments you may have. Feel free to contact us (details below).\\n\\t\\t</div>\\n        <div class=\\"uk-card uk-flex uk-flex-center uk-flex-middle uk-width-1-3 uk-background-cover \\" style=\\"height:270px;\\" data-src={train1} uk-img>\\n\\t\\t\\t</div>\\n</div>\\n<div class=\\"uk-grid-collapse\\" uk-grid>\\n\\t<div class=\\"uk-card uk-light uk-flex uk-flex-center uk-flex-middle uk-width-1-4\\" style=\\"height:250px; background-color: #0076b6;\\">\\n\\t\\t<h1 style=\\"transform: rotate(-90deg);\\">ABOUT US</h1>\\n\\t</div>\\n\\t<div class=\\"uk-card uk-flex uk-flex-center uk-flex-middle uk-width-1-2\\" style=\\"height:250px; background-color: #f5f5f5;\\">\\n\\t\\t\\n\\t\\t<div class=\\"uk-card uk-card-body uk-align-center uk-text-center\\">\\n\\t\\t\\t<h1 class = \\"uk-text-center uk-margin-top uk-margin-remove-bottom\\" style = \\"font-weight:600;\\">Filipe Teixeira</h1>\\n\\t\\t\\t<p class = \\"uk-margin-remove-top uk-margin-remove-bottom uk-padding-remove function\\" style=\\"color:#9e9e9e\\">Postdoctoral researcher at the Department of Geography (Ghent University)</p>\\n\\t\\t\\t<div class = \\"uk-align-center uk-text-center uk-margin-small\\">\\n\\t\\t\\t\\t<span class=\\"uk-badge\\" style=\\"background-color:#0076b6;\\">coordination</span>\\n\\t\\t\\t\\t<span class=\\"uk-badge\\" style=\\"background-color:#0076b6\\">development</span>\\n\\t\\t\\t\\t<span class=\\"uk-badge\\" style=\\"background-color:#0076b6\\">concept</span>\\n\\t\\t\\t\\t<span class=\\"uk-badge\\" style=\\"background-color:#0076b6\\">design</span>\\n\\t\\t\\t\\t<span class=\\"uk-badge\\" style=\\"background-color:#0076b6\\">R/shiny</span>\\n\\t\\t\\t\\t<span class=\\"uk-badge\\" style=\\"background-color:#0076b6\\">Svelte</span>\\n\\t\\t\\t</div>\\n\\t\\t\\t\\n\\t\\t\\t<div class= \\"uk-margin-remove uk-padding-remove\\">\\n\\t\\t\\t\\t<a href=\\"https://github.com/FilipeamTeixeira\\" target=\\"_blank\\">\\n\\t\\t\\t\\t\\t<span uk-icon=\\"icon: github; ratio: 1.2\\" class = \\"uk-icon-link\\"></span>\\n\\t\\t\\t\\t</a>\\n\\t\\t\\t\\t<span>&nbsp;</span>\\n\\t\\t\\t\\t\\t<a href=\\"https://twitter.com/filipeabroad\\" target=\\"_blank\\">\\n\\t\\t\\t\\t\\t\\t<span uk-icon=\\"icon: twitter; ratio: 1.2\\" class = \\"uk-icon-link\\"></span>\\n\\t\\t\\t\\t</a>\\n\\t\\t\\t</div>\\n\\n\\t\\t\\t</div>\\n\\t\\t</div>\\n\\n\\t<div class=\\"uk-card uk-flex uk-flex-center uk-flex-middle uk-width-1-4\\" style=\\"height:250px; background-color: #C7CEF6;\\">\\n\\t</div>\\n</div>\\n<div class=\\"uk-grid-collapse\\" uk-grid>\\n\\t<div class=\\"uk-light uk-card uk-flex uk-flex-center uk-flex-middle uk-width-2-5\\" style=\\"height:250px; background-color: #7496D2;\\">\\n\\n\\t\\t<div class=\\"uk-card uk-card-body uk-align-center uk-text-center\\">\\n\\t\\t\\t<h1 class = \\"uk-text-center uk-margin-top uk-margin-remove-bottom\\" style = \\"font-weight:600;\\">Freke Caset</h1>\\n\\t\\t\\t<p class = \\"uk-margin-remove-top uk-padding-remove function uk-light uk-margin-remove-bottom\\">Postdoctoral researcher at the Department of Geography (Ghent University)</p>\\n\\t\\t\\t<div class = \\"uk-align-center uk-text-center uk-margin-small\\">\\n\\t\\t\\t\\t<span class=\\"uk-badge\\" style=\\"color:#8E96C7!important;\\">concept</span>\\n\\t\\t\\t\\t<span class=\\"uk-badge\\" style=\\"color:#8E96C7!important;\\">coordination</span>\\n\\t\\t\\t\\t<span class=\\"uk-badge\\" style=\\"color:#8E96C7!important;\\">development</span>\\n\\t\\t\\t\\t<span class=\\"uk-badge\\" style=\\"color:#8E96C7!important;\\">survey development</span>\\n\\t\\t\\t</div>\\n\\n\\t\\t\\t<div class= \\"uk-margin-remove uk-padding-remove\\">\\n\\t\\t\\t\\t\\t<a href=\\"https://twitter.com/c_freke\\" target=\\"_blank\\">\\n\\t\\t\\t\\t\\t\\t<span uk-icon=\\"icon: twitter; ratio: 1.2\\" class = \\"uk-icon-link\\"></span>\\n\\t\\t\\t\\t</a>\\n\\t\\t\\t</div>\\n\\n\\t\\t</div>\\n\\n\\t</div>\\n\\t<div class=\\"uk-card uk-flex uk-flex-center uk-flex-middle uk-width-3-5 uk-background-cover\\" style=\\"height:250px;\\" data-src={train2} uk-img></div>\\n</div>\\n<div class=\\"uk-grid-collapse\\" uk-grid>\\n\\t<div class=\\"uk-card uk-flex uk-flex-center uk-flex-middle uk-width-3-5 uk-background-cover\\" style=\\"height:250px;\\" data-src={train3} uk-img></div>\\n\\t<div class=\\"uk-light uk-card uk-flex uk-flex-center uk-flex-middle uk-width-2-5\\" style=\\"height:250px; background-color: #d04444;\\">\\n\\t\\t\\n\\t\\t<div class=\\"uk-card uk-card-body uk-align-center uk-text-center\\">\\n\\t\\t\\t<h1 class = \\"uk-text-center uk-margin-top uk-margin-remove-bottom uk-padding-remove\\" style = \\"font-weight:600; font-size:30px;\\">Environmental Department</h1>\\n\\t\\t\\t<h1 class = \\"uk-text-center uk-margin-remove-top uk-margin-remove-bottom uk-padding-remove\\" style = \\"font-weight:600; font-size:30px;\\">and Green Office</h1>\\n\\t\\t\\t<p class = \\"uk-margin-remove-top uk-padding-remove function uk-light uk-margin-remove-bottom\\">Riet Van de Velde</p>\\n\\t\\t\\t<p class = \\"uk-margin-remove-top uk-padding-remove function uk-light uk-margin-remove-bottom\\">Pieter Van Vooren</p>\\n\\t\\t\\t<div class = \\"uk-align-center uk-text-center uk-margin-small\\">\\t\\n\\t\\t\\t\\t<span class=\\"uk-badge\\" style=\\"color:#d04444!important;\\">coordination</span>\\n\\t\\t\\t\\t<span class=\\"uk-badge\\" style=\\"color:#d04444!important;\\">concept</span>\\n\\t\\t\\t</div>\\n\\n\\t\\t\\t<div class= \\"uk-margin-remove uk-padding-remove uk-align-center\\">\\n\\t\\t\\t\\t\\t<a href=\\"https://www.facebook.com/Duurzaamheidskantoor\\" target=\\"_blank\\">\\n\\t\\t\\t\\t\\t\\t<span uk-icon=\\"icon: facebook; ratio: 1.2\\" class = \\"uk-icon-link\\"></span>\\n\\t\\t\\t\\t</a>\\n\\t\\t\\t\\n\\t\\t\\t\\t<span>&nbsp;</span>\\n\\t\\t\\t\\t\\t<a href=\\"https://www.ugent.be/duurzaam\\" target=\\"_blank\\">\\n\\t\\t\\t\\t\\t\\t<span uk-icon=\\"icon: home; ratio: 1.1\\" class = \\"uk-icon-link\\"></span>\\n\\t\\t\\t\\t</a>\\n\\t\\t\\t</div>\\n\\n\\t\\t</div>\\n\\t\\t\\n\\t\\t\\n\\t</div>\\n</div>\\n\\n<style>\\n\\n.test{\\n    color: #675864;\\n    color:#d37861;\\n    color:#144a81;\\n    color:#d04444;\\n    color:#93b3ad;\\n    color:#147074;\\n    color:#0076b6;\\n}\\n\\n.function{\\n\\tfont-weight:100;\\n\\tfont-family:Helvetica;\\n\\tfont-size:14px;\\n}\\n\\n\\n</style>\\n"],"names":[],"mappings":"AA+HA,uBAAS,CAAC,AACT,YAAY,GAAG,CACf,YAAY,SAAS,CACrB,UAAU,IAAI,AACf,CAAC"}`
};
var prerender$4 = true;
var About_us = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$2);
  return `${$$result.head += `${$$result.title = `<title>About Us</title>`, ""}`, ""}


<div class="${"uk-grid-collapse"}" uk-grid><div class="${"uk-text-justify uk-light uk-card uk-flex uk-flex-center uk-flex-middle uk-width-2-3"}" style="${"padding: 40px; font-family:Helvetica; font-weight:100; height:270px; background-color: #93b3ad;"}">This Academic Travel platform is an initiative from the Environmental Department, the Green Office and the Geography Department, all embedded within Ghent University. 
			The tool was conceptualized and developed in light of the new UGent sustainable travel policy which was rolled out in September 2021. 
			In its initial stage, &#39;Academic Travel&#39; aims to serve as a sensitizing and inspirational tool for the community of UGent employees, 
			hoping to stimulate the transition towards more sustainable work-related travels. 
			A number of UGent members in particular have dedicated their time into realising this 
			tool and are listed below. We are very keen on receiving any feedback or comments you may have. Feel free to contact us (details below).
		</div>
        <div class="${"uk-card uk-flex uk-flex-center uk-flex-middle uk-width-1-3 uk-background-cover "}" style="${"height:270px;"}"${add_attribute("data-src", train1, 0)} uk-img></div></div>
<div class="${"uk-grid-collapse"}" uk-grid><div class="${"uk-card uk-light uk-flex uk-flex-center uk-flex-middle uk-width-1-4"}" style="${"height:250px; background-color: #0076b6;"}"><h1 style="${"transform: rotate(-90deg);"}">ABOUT US</h1></div>
	<div class="${"uk-card uk-flex uk-flex-center uk-flex-middle uk-width-1-2"}" style="${"height:250px; background-color: #f5f5f5;"}"><div class="${"uk-card uk-card-body uk-align-center uk-text-center"}"><h1 class="${"uk-text-center uk-margin-top uk-margin-remove-bottom"}" style="${"font-weight:600;"}">Filipe Teixeira</h1>
			<p class="${"uk-margin-remove-top uk-margin-remove-bottom uk-padding-remove function svelte-2gqjzg"}" style="${"color:#9e9e9e"}">Postdoctoral researcher at the Department of Geography (Ghent University)</p>
			<div class="${"uk-align-center uk-text-center uk-margin-small"}"><span class="${"uk-badge"}" style="${"background-color:#0076b6;"}">coordination</span>
				<span class="${"uk-badge"}" style="${"background-color:#0076b6"}">development</span>
				<span class="${"uk-badge"}" style="${"background-color:#0076b6"}">concept</span>
				<span class="${"uk-badge"}" style="${"background-color:#0076b6"}">design</span>
				<span class="${"uk-badge"}" style="${"background-color:#0076b6"}">R/shiny</span>
				<span class="${"uk-badge"}" style="${"background-color:#0076b6"}">Svelte</span></div>
			
			<div class="${"uk-margin-remove uk-padding-remove"}"><a href="${"https://github.com/FilipeamTeixeira"}" target="${"_blank"}"><span uk-icon="${"icon: github; ratio: 1.2"}" class="${"uk-icon-link"}"></span></a>
				<span>\xA0</span>
					<a href="${"https://twitter.com/filipeabroad"}" target="${"_blank"}"><span uk-icon="${"icon: twitter; ratio: 1.2"}" class="${"uk-icon-link"}"></span></a></div></div></div>

	<div class="${"uk-card uk-flex uk-flex-center uk-flex-middle uk-width-1-4"}" style="${"height:250px; background-color: #C7CEF6;"}"></div></div>
<div class="${"uk-grid-collapse"}" uk-grid><div class="${"uk-light uk-card uk-flex uk-flex-center uk-flex-middle uk-width-2-5"}" style="${"height:250px; background-color: #7496D2;"}"><div class="${"uk-card uk-card-body uk-align-center uk-text-center"}"><h1 class="${"uk-text-center uk-margin-top uk-margin-remove-bottom"}" style="${"font-weight:600;"}">Freke Caset</h1>
			<p class="${"uk-margin-remove-top uk-padding-remove function uk-light uk-margin-remove-bottom svelte-2gqjzg"}">Postdoctoral researcher at the Department of Geography (Ghent University)</p>
			<div class="${"uk-align-center uk-text-center uk-margin-small"}"><span class="${"uk-badge"}" style="${"color:#8E96C7!important;"}">concept</span>
				<span class="${"uk-badge"}" style="${"color:#8E96C7!important;"}">coordination</span>
				<span class="${"uk-badge"}" style="${"color:#8E96C7!important;"}">development</span>
				<span class="${"uk-badge"}" style="${"color:#8E96C7!important;"}">survey development</span></div>

			<div class="${"uk-margin-remove uk-padding-remove"}"><a href="${"https://twitter.com/c_freke"}" target="${"_blank"}"><span uk-icon="${"icon: twitter; ratio: 1.2"}" class="${"uk-icon-link"}"></span></a></div></div></div>
	<div class="${"uk-card uk-flex uk-flex-center uk-flex-middle uk-width-3-5 uk-background-cover"}" style="${"height:250px;"}"${add_attribute("data-src", train2, 0)} uk-img></div></div>
<div class="${"uk-grid-collapse"}" uk-grid><div class="${"uk-card uk-flex uk-flex-center uk-flex-middle uk-width-3-5 uk-background-cover"}" style="${"height:250px;"}"${add_attribute("data-src", train3, 0)} uk-img></div>
	<div class="${"uk-light uk-card uk-flex uk-flex-center uk-flex-middle uk-width-2-5"}" style="${"height:250px; background-color: #d04444;"}"><div class="${"uk-card uk-card-body uk-align-center uk-text-center"}"><h1 class="${"uk-text-center uk-margin-top uk-margin-remove-bottom uk-padding-remove"}" style="${"font-weight:600; font-size:30px;"}">Environmental Department</h1>
			<h1 class="${"uk-text-center uk-margin-remove-top uk-margin-remove-bottom uk-padding-remove"}" style="${"font-weight:600; font-size:30px;"}">and Green Office</h1>
			<p class="${"uk-margin-remove-top uk-padding-remove function uk-light uk-margin-remove-bottom svelte-2gqjzg"}">Riet Van de Velde</p>
			<p class="${"uk-margin-remove-top uk-padding-remove function uk-light uk-margin-remove-bottom svelte-2gqjzg"}">Pieter Van Vooren</p>
			<div class="${"uk-align-center uk-text-center uk-margin-small"}"><span class="${"uk-badge"}" style="${"color:#d04444!important;"}">coordination</span>
				<span class="${"uk-badge"}" style="${"color:#d04444!important;"}">concept</span></div>

			<div class="${"uk-margin-remove uk-padding-remove uk-align-center"}"><a href="${"https://www.facebook.com/Duurzaamheidskantoor"}" target="${"_blank"}"><span uk-icon="${"icon: facebook; ratio: 1.2"}" class="${"uk-icon-link"}"></span></a>
			
				<span>\xA0</span>
					<a href="${"https://www.ugent.be/duurzaam"}" target="${"_blank"}"><span uk-icon="${"icon: home; ratio: 1.1"}" class="${"uk-icon-link"}"></span></a></div></div></div>
</div>`;
});
var about_us = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": About_us,
  prerender: prerender$4
});
var logo_economics = "/_app/assets/logo_economics.3baa2144.png";
var logo_political = "/_app/assets/logo_political.499a21e0.png";
var logo_science = "/_app/assets/logo_sciences.7f520b75.png";
var group$1 = {
  journal: [],
  doctoral: [],
  master: [
    {
      authors: "Van Acker, S.",
      title: "\u2018How to reduce the carbon cost of academic air travel? A quantitative analysis of the air travel behavior at Ghent University\u2019",
      year: "2020",
      journal: "",
      pages: ""
    },
    {
      authors: "Govaert, I.",
      title: "\u2018\u2018Evaluatie van de CO2-bijdrage van vliegreizen aan Universiteit Gent.\u2019",
      year: "2019",
      journal: "",
      pages: ""
    },
    {
      authors: "Burrick, M.",
      title: "\u2018Reizen in een institutionele leemte: Kan de UGent het voortouw nemen in een duurzaam reisbeleid?\u2019",
      year: "2018",
      journal: "",
      pages: ""
    }
  ],
  media: []
};
var research_economics = {
  group: group$1
};
var group = {
  journal: [
    {
      authors: "Gaalen, A.",
      title: "Mapping undesired consequences of internationalization of higher education. In: Kommers & Bista (eds). Inequalities in Study Abroad and Student Mobility. Navigating Challenges and Future Directions.",
      year: "2020",
      journal: "New York: Routledge.",
      pages: "Chapter 2, p. 11-23"
    },
    {
      authors: "Nikula, PT, & Gaalen, A. van",
      title: "Balancing International Education and its Carbon Footprint (Critical Internationalization Studies Network Newsletter)",
      year: "2021",
      journal: "Critical Voices",
      pages: "1(4)"
    }
  ],
  doctoral: [],
  master: [],
  media: []
};
var research_politics = {
  group
};
var geography = {
  journal: [
    {
      authors: "Wenner, F., Caset, F., De Wit, B. ",
      title: "\u2018Conference locations and sustainability aspirations : towards an integrative framework?\u2019",
      year: "2019",
      journal: "DisP The planning Review",
      pages: "55 (1), 34\u201351"
    },
    {
      authors: "Caset, F., Boussauw, K., Storme, T. ",
      title: "\u2018Meet & fly : sustainable transport academics and the elephant in the room\u2019",
      year: "2018",
      journal: "Journal of Transport Geography",
      pages: "70, 64 \u2013 67"
    }
  ],
  doctoral: [
    {
      authors: "Storme, T.",
      title: "Exploring a small world: motivations and obligations for academic travel in a Flemish context.",
      year: "2014",
      journal: "",
      pages: ""
    }
  ],
  master: [],
  media: [
    {
      authors: "Boussauw, K., Storme, T., Caset, F.",
      title: "\u2018Airmiles zijn geen statussymbool\u2019",
      year: "2018",
      journal: "De Standaard",
      pages: ""
    }
  ]
};
var research_sciences = {
  geography
};
var prerender$3 = true;
var Research = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `


<div class="${"uk-section uk-margin-small-left uk-margin-small-right uk-padding-small-top"}" style="${"background-color: #F5F5F5;"}"><div class="${"uk-child-width-1-3@m uk-grid-small uk-padding-remove-bottom uk-margin-remove-bottom"}" uk-grid><div><div class="${"uk-padding-remove uk-margin-remove"}"><img${add_attribute("src", logo_science, 0)} alt="${""}" class="${"uk-padding-remove-top uk-margin-remove-top"}"></div>
            <div class="${"uk-tile uk-padding-remove-top"}"><h2 class="${"uk-text-bold"}">Department of Geography, Social and Economic Geography</h2>
				<p class="${"uk-text-bold"}" style="${"font-family:Helvetica; font-weight:400"}">Journal publications:</p>
				${each(research_sciences["geography"]["journal"], (research_sciences2) => `<p style="${"font-family:Helvetica; font-weight:100;"}">${escape2(research_sciences2.authors)} 
					(${escape2(research_sciences2.year)})<br>
					${escape2(research_sciences2.title)} <br>
					${escape2(research_sciences2.journal)} 
					${escape2(research_sciences2.pages)}</p>`)}

				<p class="${"uk-text-bold"}" style="${"font-family:Helvetica; font-weight:400"}">Doctoral dissertations:</p>
				${each(research_sciences["geography"]["doctoral"], (research_sciences2) => `<p style="${"font-family:Helvetica; font-weight:100;"}">${escape2(research_sciences2.authors)} 
					(${escape2(research_sciences2.year)})<br>
					${escape2(research_sciences2.title)} <br>
					${escape2(research_sciences2.journal)} 
					${escape2(research_sciences2.pages)}</p>`)}

				<p class="${"uk-text-bold"}" style="${"font-family:Helvetica; font-weight:400"}">Master dissertations:</p>
				${each(research_sciences["geography"]["master"], (research_sciences2) => `<p style="${"font-family:Helvetica; font-weight:100;"}">${escape2(research_sciences2.authors)} 
					(${escape2(research_sciences2.year)})<br>
					${escape2(research_sciences2.title)} <br>
					${escape2(research_sciences2.journal)} 
					${escape2(research_sciences2.pages)}</p>`)}

				<p class="${"uk-text-bold"}" style="${"font-family:Helvetica; font-weight:400"}">Media articles:</p>
				${each(research_sciences["geography"]["media"], (research_sciences2) => `<p style="${"font-family:Helvetica; font-weight:100;"}">${escape2(research_sciences2.authors)} 
					(${escape2(research_sciences2.year)})<br>
					${escape2(research_sciences2.title)} <br>
					${escape2(research_sciences2.journal)} 
					${escape2(research_sciences2.pages)}</p>`)}</div></div>


        <div><div class="${"uk-padding-remove uk-margin-remove"}"><img${add_attribute("src", logo_economics, 0)} alt="${""}" class="${"uk-padding-remove uk-margin-remove"}"></div>
            <div class="${"uk-tile uk-padding-remove uk-margin-remove"}"><h2 class="${"uk-text-bold"}">Centre for Sustainable Development</h2>
				<p class="${"uk-text-bold"}" style="${"font-family:Helvetica; font-weight:400"}">Journal publications:</p>
				${each(research_economics["group"]["journal"], (research_economics2) => `<p style="${"font-family:Helvetica; font-weight:100;"}">${escape2(research_economics2.authors)} 
					(${escape2(research_economics2.year)})<br>
					${escape2(research_economics2.title)} <br>
					${escape2(research_economics2.journal)} 
					${escape2(research_economics2.pages)}</p>`)}

				<p class="${"uk-text-bold"}" style="${"font-family:Helvetica; font-weight:400"}">Doctoral dissertations:</p>
				${each(research_economics["group"]["doctoral"], (research_economics2) => `<p style="${"font-family:Helvetica; font-weight:100;"}">${escape2(research_economics2.authors)} 
					(${escape2(research_economics2.year)})<br>
					${escape2(research_economics2.title)} <br>
					${escape2(research_economics2.journal)} 
					${escape2(research_economics2.pages)}</p>`)}

				<p class="${"uk-text-bold"}" style="${"font-family:Helvetica; font-weight:400"}">Master dissertations:</p>
				${each(research_economics["group"]["master"], (research_economics2) => `<p style="${"font-family:Helvetica; font-weight:100;"}">${escape2(research_economics2.authors)} 
					(${escape2(research_economics2.year)})<br>
					${escape2(research_economics2.title)} <br>
					${escape2(research_economics2.journal)} 
					${escape2(research_economics2.pages)}</p>`)}

				<p class="${"uk-text-bold"}" style="${"font-family:Helvetica; font-weight:400"}">Media articles:</p>
				${each(research_economics["group"]["media"], (research_economics2) => `<p style="${"font-family:Helvetica; font-weight:100;"}">${escape2(research_economics2.authors)} 
					(${escape2(research_economics2.year)})<br>
					${escape2(research_economics2.title)} <br>
					${escape2(research_economics2.journal)} 
					${escape2(research_economics2.pages)}</p>`)}</div></div>



        <div><div class="${"uk-padding-remove uk-margin-remove"}"><img${add_attribute("src", logo_political, 0)} alt="${""}" class="${"uk-padding-remove uk-margin-remove"}"></div>
            <div class="${"uk-tile uk-padding-remove-top"}"><h2 class="${"uk-text-bold"}">Centre for Higher Education Governance Ghent (CHEGG)</h2>
				<p class="${"uk-text-bold"}" style="${"font-family:Helvetica; font-weight:400"}">Journal publications:</p>
				${each(research_politics["group"]["journal"], (research_politics2) => `<p style="${"font-family:Helvetica; font-weight:100;"}">${escape2(research_politics2.authors)} 
					(${escape2(research_politics2.year)})<br>
					${escape2(research_politics2.title)} <br>
					${escape2(research_politics2.journal)} 
					${escape2(research_politics2.pages)}</p>`)}

				<p class="${"uk-text-bold"}" style="${"font-family:Helvetica; font-weight:400"}">Doctoral dissertations:</p>
				${each(research_politics["group"]["doctoral"], (research_politics2) => `<p style="${"font-family:Helvetica; font-weight:100;"}">${escape2(research_politics2.authors)} 
					(${escape2(research_politics2.year)})<br>
					${escape2(research_politics2.title)} <br>
					${escape2(research_politics2.journal)} 
					${escape2(research_politics2.pages)}</p>`)}

				<p class="${"uk-text-bold"}" style="${"font-family:Helvetica; font-weight:400"}">Master dissertations:</p>
				${each(research_politics["group"]["master"], (research_politics2) => `<p style="${"font-family:Helvetica; font-weight:100;"}">${escape2(research_politics2.authors)} 
					(${escape2(research_politics2.year)})<br>
					${escape2(research_politics2.title)} <br>
					${escape2(research_politics2.journal)} 
					${escape2(research_politics2.pages)}</p>`)}

				<p class="${"uk-text-bold"}" style="${"font-family:Helvetica; font-weight:400"}">Media articles:</p>
				${each(research_politics["group"]["media"], (research_politics2) => `<p style="${"font-family:Helvetica; font-weight:100;"}">${escape2(research_politics2.authors)} 
					(${escape2(research_politics2.year)})<br>
					${escape2(research_politics2.title)} <br>
					${escape2(research_politics2.journal)} 
					${escape2(research_politics2.pages)}</p>`)}</div></div></div></div>`;
});
var research = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Research,
  prerender: prerender$3
});
var css$1 = {
  code: "a.svelte-5rli68:hover,a.svelte-5rli68:visited,a.svelte-5rli68:link,a.svelte-5rli68:active{text-decoration:none}.zoom.svelte-5rli68:hover{transform:scale(1.1);z-index:3;position:relative}",
  map: `{"version":3,"file":"stories.svelte","sources":["stories.svelte"],"sourcesContent":["<script context=\\"module\\">\\n    export const prerender = true;\\n    import stories from \\"/static/json_files/frdata.json\\"\\n\\n<\/script>\\n\\n<div class=\\"uk-child-width-1-3@s uk-grid-collapse uk-text-center uk-light\\" uk-grid>\\n        {#each stories as stories}\\n        <div class=\\"uk-tile uk-tile-default zoom uk-transition-toggle uk-animation-toggle\\" style=\\"background-color:{stories.color}\\">\\n            <h1 class = \\"uk-text-center uk-margin-medium-left\\" style = \\"font-weight:600;\\">{stories.first_name} {stories.last_name} </h1>\\n            <p class = \\"uk-text-meta uk-text-center uk-margin-medium-left\\">{stories.bio}</p>\\n            <!-- removed class=\\"uk-transition-slide-bottom-small\\"-->\\n            <div class=\\"uk-card-footer uk-position-bottom\\">\\n                <span class = \\"uk-light uk-margin-small-right\\" uk-icon=\\"info\\"></span>\\n                <span class = \\"uk-light\\" style=\\"font-size: 14px;\\">Read story</span>\\n            </div>\\n        </div>\\n        {/each}\\n</div>\\n\\n\\n<div class=\\"uk-position-relative uk-visible-toggle uk-light\\" tabindex=\\"-1\\" uk-slider>\\n\\n\\n\\n<a class=\\"uk-position-center-left uk-position-small uk-hidden-hover\\" href=\\"#\\" uk-slidenav-previous uk-slider-item=\\"previous\\"></a>\\n<a class=\\"uk-position-center-right uk-position-small uk-hidden-hover\\" href=\\"#\\" uk-slidenav-next uk-slider-item=\\"next\\"></a>\\n\\n</div>\\n\\n<!-- TODO:\\n    1- add id to name in shiny\\n    2- add 3 parts of the story-->\\n\\n{#each stories as stories}\\n<div id={stories.id} class=\\"uk-modal-full\\" uk-modal>\\n    <div class=\\"uk-modal-dialog\\">\\n        <button class=\\"uk-modal-close-full uk-close-large\\" type=\\"button\\" uk-close></button>\\n        <div class=\\"uk-grid-collapse uk-child-width-1-2@s uk-flex-middle\\" uk-grid>\\n<!--            <div class=\\"uk-background-cover\\" style=\\"background-image: url('/static/stories_pics/{stories.picture}');\\" uk-height-viewport></div>\\n            <div class=\\"uk-height-medium uk-flex uk-flex-center uk-flex-middle uk-background-cover\\" data-src = \\"static/stories_pics/{stories.picture}\\" uk-img uk-height-viewport></div>\\n-->\\n            <img src = \\"/stories_pics/{stories.picture}\\" alt=\\"\\">\\n            <div class=\\"uk-padding-large\\">\\n                <h1>{stories.first_name} {stories.last_name}</h1>\\n                <p class = \\"uk-text-meta\\">{stories.bio}</p>\\n                <h1 style = \\"text-align:left; font-size:20px; font-weight:600;\\">Which initiatives have you taken/are you taking?</h1>\\n                <p class = \\"uk-text-justify\\">{stories.storyA}</p>\\n                <h1 style = \\"text-align:left; font-size:20px; font-weight:600;\\">Do you have any tips to convince your colleagues?</h1>\\n                <p class = \\"uk-text-justify\\">{stories.storyB}</p>\\n            </div>\\n        </div>\\n    </div>\\n</div>\\n{/each}\\n\\n\\n<style>\\n\\na:hover, a:visited, a:link, a:active{\\n    text-decoration: none;\\n}\\n\\n.zoom:hover {\\n  transform: scale(1.1);\\n  z-index: 3;\\n  position:relative;\\n} \\n\\n.uk-section{\\n    margin:20px;\\n}\\n.uk-card-body{\\n    color: rgb(61, 61, 61);\\n    font-family: Roboto;\\n    font-weight: 200;\\n    font-size: 18px;\\n}\\n\\n\\n</style>\\n\\n\\n\\n\\n<!--\\n\\n            {#each stories as stories}\\n        <div class=\\"uk-grid-divider uk-child-width-expand@s frontrun\\" uk-grid>\\n\\n    <div>\\n        <div class=\\"uk-card\\">\\n            <div class=\\"uk-card-media-top\\">\\n                <img src = {stories.picture} alt = \\"\\">\\n            </div>\\n            <div class=\\"uk-card-body\\">\\n                <h3 class=\\"uk-card-title\\">{stories.name}</h3>\\n                <p>{stories.bio}</p>\\n            </div>\\n        </div>\\n    </div>\\n    <div>\\n        <h3>Story</h3>\\n        <p class = \\"uk-text-justify\\">\\n            {stories.story}\\n        </p>\\n    </div>\\n    </div>\\n    {/each}\\n\\n-->\\n\\n<!--\\n    Colors:\\n    675864\\n    d37861\\n    144a81\\n    d04444\\n    93b3ad\\n    147074\\n    0076b6\\n-->"],"names":[],"mappings":"AA2DA,eAAC,MAAM,CAAE,eAAC,QAAQ,CAAE,eAAC,KAAK,CAAE,eAAC,OAAO,CAAC,AACjC,eAAe,CAAE,IAAI,AACzB,CAAC,AAED,mBAAK,MAAM,AAAC,CAAC,AACX,SAAS,CAAE,MAAM,GAAG,CAAC,CACrB,OAAO,CAAE,CAAC,CACV,SAAS,QAAQ,AACnB,CAAC"}`
};
var prerender$2 = true;
var Stories = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$1);
  return `<div class="${"uk-child-width-1-3@s uk-grid-collapse uk-text-center uk-light"}" uk-grid>${each(stories$1, (stories2) => `<div class="${"uk-tile uk-tile-default zoom uk-transition-toggle uk-animation-toggle svelte-5rli68"}" style="${"background-color:" + escape2(stories2.color)}"><h1 class="${"uk-text-center uk-margin-medium-left"}" style="${"font-weight:600;"}">${escape2(stories2.first_name)} ${escape2(stories2.last_name)}</h1>
            <p class="${"uk-text-meta uk-text-center uk-margin-medium-left"}">${escape2(stories2.bio)}</p>
            
            <div class="${"uk-card-footer uk-position-bottom"}"><span class="${"uk-light uk-margin-small-right"}" uk-icon="${"info"}"></span>
                <span class="${"uk-light"}" style="${"font-size: 14px;"}">Read story</span></div>
        </div>`)}</div>


<div class="${"uk-position-relative uk-visible-toggle uk-light"}" tabindex="${"-1"}" uk-slider><a class="${"uk-position-center-left uk-position-small uk-hidden-hover svelte-5rli68"}" href="${"#"}" uk-slidenav-previous uk-slider-item="${"previous"}"></a>
<a class="${"uk-position-center-right uk-position-small uk-hidden-hover svelte-5rli68"}" href="${"#"}" uk-slidenav-next uk-slider-item="${"next"}"></a></div>



${each(stories$1, (stories2) => `<div${add_attribute("id", stories2.id, 0)} class="${"uk-modal-full"}" uk-modal><div class="${"uk-modal-dialog"}"><button class="${"uk-modal-close-full uk-close-large"}" type="${"button"}" uk-close></button>
        <div class="${"uk-grid-collapse uk-child-width-1-2@s uk-flex-middle"}" uk-grid>
            <img src="${"/stories_pics/" + escape2(stories2.picture)}" alt="${""}">
            <div class="${"uk-padding-large"}"><h1>${escape2(stories2.first_name)} ${escape2(stories2.last_name)}</h1>
                <p class="${"uk-text-meta"}">${escape2(stories2.bio)}</p>
                <h1 style="${"text-align:left; font-size:20px; font-weight:600;"}">Which initiatives have you taken/are you taking?</h1>
                <p class="${"uk-text-justify"}">${escape2(stories2.storyA)}</p>
                <h1 style="${"text-align:left; font-size:20px; font-weight:600;"}">Do you have any tips to convince your colleagues?</h1>
                <p class="${"uk-text-justify"}">${escape2(stories2.storyB)}</p></div>
        </div></div>
</div>`)}









`;
});
var stories = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Stories,
  prerender: prerender$2
});
var accessibility = [
  {
    title: "Which cities can you reach relatively comfortably by train in less than 8 hours of travel?",
    content: "Click on the 'maps' tab. Here you can find an overview of these cities, along with an estimate of the travel time and number of transfers."
  },
  {
    title: "Which cities can you reach relatively comfortably by night train?",
    content: '<a href="https://rail.cc/night-train/belgium/be" target="_blank">Here</a> you will find an overview of the night trains, e.g. from Brussels (to Vienna and Innsbruck), from Cologne (to Munich and Nuremberg), from Hendaye (to Madrid), ... In 2022, trains will also go from Brussels to Malm\xF6 and Berlin.'
  }
];
var reservation = [
  {
    title: "Where can I book long-distance trains?",
    content: 'UGent employees can use our contract with Uniglobe Smart Travel. This organisation takes care of your train booking. You can also book directly via <a href="https://www.b-europe.com/EN" target="_blank">SNCB</a>. For complicated routes you can also make use of <a href="https://www.happyrail.com/en" target="_blank">HappyRail</a>. Booking well in advance (3 to 6 months before your trip) is recommended.'
  },
  {
    title: "How do you book a night train?",
    content: "This depends on the train company that operates the train. All information can be found here."
  },
  {
    title: "Can you use an Interrail Global Pass?",
    content: 'The <a href="https://www.interrail.eu/en/interrail-passes/global-pass?&msclkid=b90242fa65c31128246b23ef73b2ac30&utm_source=bing&utm_medium=cpc&utm_campaign=BE_NL_02_Brand-Combi_AlwaysOn-DO-BE&utm_term=interrail%20global%20pass&utm_content=BE_NL_02_Exact&gclid=b90242fa65c31128246b23ef73b2ac30&gclsrc=3p.ds" target="_blank">Interrail Global pass</a> is not only available for youngsters! It can also be financially advantageous for staff when the train ticket is expensive or when you travel to multiple destinations in a short period of time. A pass for 4 travel days within 1 month costs 246 EUR. For young people the fares are much lower. Please mind: for high speed trains there may be extra charges for reservations.'
  },
  {
    title: "Will external funders accept a more expensive train ticket when compared to a flight ticket? ",
    content: "Each institution should pursue ambitious CO2 reduction objectives. If you do encounter problems, you can always contact duurzaam@ugent.be. We will then try to start a dialogue with them. "
  }
];
var obstacles = [
  {
    title: "Is there a compensation for more expensive train tickets for UGent staff?",
    content: 'Train travel is subsidized by 30 EUR for train tickets > 100 EUR or by 100 EUR for train tickets > 200 EUR. You can find the procedure <a href="https://www.ugent.be/en/ghentuniv/principles/sustainability/guidelines/travel/subsidytraintickets" target="_blank">here</a>.'
  },
  {
    title: "Is there a compensation for more expensive train tickets for visitors?",
    content: "If the train ticket is not purchased by a staff member from Ghent University, then there is no compensation. We rely on similar efforts by the visitor's organization. If the train ticket is purchased by Ghent University, then the same subsidy scheme applies."
  },
  {
    title: "Is there a compensation for more expensive train tickets for UGent students?",
    content: "There will be a top-up grant for students who want to travel sustainably. A first phase will involve Erasmus+ and we hope to later extend this for all student travel grants."
  },
  {
    title: "Will you be compensated if the train journey makes your travel a day or so longer?",
    content: "Yes. A daily allowance can be obtained for the extra day of travel. There is also an allowance for students."
  }
];
var tips = [
  {
    title: "Getting to and from the station",
    content: 'As is the case when travelling to and from an airport, it is easy to use a taxi service at European railway stations. If you know the area well (or you want to prepare well), you can also use the bus or a shared bicycle system. In Belgium there is <a href="https://www.blue-bike.be/en" target="_blank">BlueBike</a>, in the Netherlands the <a href="https://www.ns.nl/en/door-to-door/ov-fiets" target="_blank">OV-bike</a>, and there are plenty of other local initiatives, for example, in the <a href="https://www.cyclinguk.org/article/guide-hire-bikes-and-public-bike-share-schemes" target="_blank">UK</a> and in <a href="https://www.sbb.ch/en/station-services/at-the-station/getting-to-and-from-the-station.html" target="_blank">Switzerland</a>.'
  }
];
var sustainability = [
  {
    title: "What is the difference in CO2 emissions between my flight and my train journey?",
    content: 'With the <a href="http://www.ecopassenger.org/bin/query.exe/en?L=vs_uic" target="_blank">Ecopassenger</a> site you can compare the CO2 impact of your trip by train or plane.'
  },
  {
    title: "How does Ghent University stimulate more sustainable academic travel?",
    content: 'With a <a href="https://www.ugent.be/en/ghentuniv/principles/sustainability/guidelines/travel/overview.htm" target="_blank">sustainable travel policy</a>, Ghent University commits itself to fly less and to travel more conscientiously and more sustainably. We aim to reduce the CO2 emissions of the total air travel by at least 1/3rd by 2030 as compared to 2019.'
  },
  {
    title: "Can we monitor the CO2 impact of our business trips?",
    content: 'Yes. Targets have been defined for each faculty (at least 1/3 reduction in CO2 emissions from flights by 2030 as compared to 2019). These are monitored annually using a <a href="https://www.ugent.be/en/ghentuniv/principles/sustainability/guidelines/travel/monitor" target="_blank">mobility barometer</a>.'
  },
  {
    title: "How can we convince our fellow colleagues at Ghent University to travel more sustainably?",
    content: 'Awareness-raising material will be distributed and can be requested at duurzaam@ugent.be. Additionally, the faculty-specific <a href="https://www.ugent.be/en/ghentuniv/principles/sustainability/guidelines/travel/monitor" target="_blank">mobility barometer</a> (which will be extended to the departments in a later phase) will keep the pressure high and will hopefully nudge people towards reaching our ambitious goals together.'
  },
  {
    title: "How can we also convince our research partners to take the train more often?",
    content: 'There is a call for UGent to take the lead in international research partnerships by making prior agreements on travel behavior. Here you can find an <a href="https://www.ugent.be/en/ghentuniv/principles/sustainability/guidelines/travel/overview.htm" target="_blank">example of a charter</a> that you can draw on together with your research partners.'
  }
];
var policy = [
  {
    title: "How is Ghent University planning to reduce its business flights?",
    content: `In order to reduce CO2 emissions by 1/3 by 2030, trains should be chosen instead of planes where possible. The number of journeys should also be reduced. These guidelines of the <a href="https://www.ugent.be/en/ghentuniv/principles/sustainability/guidelines/travel/overview.htm" target="_blank">sustainable travel policy</a> must be followed: <ul> <li> Reduce travel through online meetings and conferences; </li> <li> If we can get somewhere within 8 hours by train, we are expected to do so;</li><li> In international research collaborations, Ghent University takes the lead by making prior arrangements concerning travel behaviour;</li><li> For each flight, a contribution of 50 EUR/tonne of CO2 is charged. This contribution is used to realise CO2 reductions in a climate project in order to subsidise train journeys and to feed a provision for 'living labs'.</li></ul>`
  },
  {
    title: "If we invite guests and we pay the flight ticket, do we have to follow the travel policy of Ghent University?",
    content: 'If the flight ticket is paid by someone of Ghent University, the guidelines of the <a href="https://www.ugent.be/en/ghentuniv/principles/sustainability/guidelines/travel/overview.htm" target="_blank">sustainable travel policy</a> must be followed. It means that you propose your guest to travel by train if the destination can be reached within 8 hours travelling by train. A CO2 tax of 50 EUR/ton CO2 is charged.'
  },
  {
    title: "If we are invited by international organisations and they pay the flight ticket, do we have to follow the travel policy of Ghent University?",
    content: 'If your flight ticket is paid by another institution, the <a href="https://www.ugent.be/en/ghentuniv/principles/sustainability/guidelines/travel/overview.htm" target="_blank">sustainable travel policy</a> must not be followed. Of course you can still suggest to follow the guidelines of Ghent University.'
  }
];
var json_faq = {
  accessibility,
  reservation,
  obstacles,
  tips,
  sustainability,
  policy
};
var css = {
  code: ".uk-accordion-title.svelte-1lhvux6{color:rgb(61, 61, 61);font-family:Roboto;font-weight:300;font-size:14px}.uk-h4.svelte-1lhvux6{color:#94bb9f;font-weight:300;font-size:18px}.uk-accordion-content.svelte-1lhvux6{font-weight:300;font-size:small}",
  map: `{"version":3,"file":"faq_en.svelte","sources":["faq_en.svelte"],"sourcesContent":["\\n<script>\\n\\nimport json_faq from \\"/static/json_files/faq_en.json\\"\\n\\n<\/script>\\n\\n<div uk-filter=\\"target: .filter\\" class=\\"uk-width-1-1\\">\\n\\n    <div class=\\"uk-section uk-margin-small-left uk-margin-small-right uk-padding-small-top\\" style=\\"background-color: #F5F5F5;\\">\\n        <div class=\\"uk-grid-match uk-child-width-1-3@m uk-grid-small  uk-padding-remove-bottom uk-margin-remove-bottom\\" uk-grid >\\n        <div>\\n            <div class=\\"uk-tile uk-padding-remove-top\\">\\n                <p class=\\"uk-h4\\">ACCESSIBILITY BY TRAIN</p>\\n                    <ul uk-accordion class = \\"filter\\">\\n                            {#each json_faq['accessibility'] as faq}\\n                                <li class = \\"skills-el\\" data-name = \\"div 1\\">\\n                                <a class=\\"uk-accordion-title\\" href=\\"#\\">{faq.title}</a>\\n                                    <div class=\\"uk-accordion-content\\">\\n                                        <p>{@html faq.content}</p>\\n                                    </div>\\n                                </li>\\n                                {/each}\\n                    </ul>\\n            </div>\\n        </div>\\n            <div>\\n                <div class=\\"uk-tile uk-padding-remove-top\\">\\n                    <p class=\\"uk-h4\\">RESERVATION</p>\\n                        <ul uk-accordion>\\n                                {#each json_faq['reservation'] as faq}\\n                                    <li>\\n                                    <a class=\\"uk-accordion-title\\" href=\\"#\\">{faq.title}</a>\\n                                        <div class=\\"uk-accordion-content\\">\\n                                            <p>{@html faq.content}</p>\\n                                        </div>\\n                                    </li>\\n                                    {/each}\\n                        </ul>\\n                </div>\\n            </div>\\n    \\n            <div>\\n                <div class=\\"uk-tile uk-padding-remove-top uk-margin-remove-top\\">\\n                    <p class=\\"uk-h4\\">POSSIBLE OBSTACLES</p>\\n                    <ul uk-accordion>\\n                            {#each json_faq['obstacles'] as faq}\\n                                <li>\\n                                <a class=\\"uk-accordion-title\\" href=\\"#\\">{faq.title}</a>\\n                                    <div class=\\"uk-accordion-content\\">\\n                                        <p>{@html faq.content}</p>\\n                                    </div>\\n                                </li>\\n                                {/each}\\n                    </ul>\\n                </div>\\n            </div>\\n        </div>\\n    \\n            <div class=\\"uk-grid-match uk-child-width-1-3@m uk-grid-small uk-padding-remove-top uk-margin-remove-top\\" uk-grid >\\n                    <div>\\n                        <div class=\\"uk-tile uk-padding-remove-top uk-margin-remove-top\\">\\n                            <p class=\\"uk-h4\\">SUSTAINABILITY</p>\\n                            <ul uk-accordion>\\n                                    {#each json_faq['sustainability'] as faq}\\n                                        <li>\\n                                        <a class=\\"uk-accordion-title\\" href=\\"#\\">{faq.title}</a>\\n                                            <div class=\\"uk-accordion-content\\">\\n                                                <p>{@html faq.content}</p>\\n                                            </div>\\n                                        </li>\\n                                        {/each}\\n                            </ul>\\n                        </div>\\n                    </div>\\n    \\n                <div>\\n                    <div class=\\"uk-tile uk-padding-remove-top uk-margin-remove-top\\">\\n                        <p class=\\"uk-h4\\">TRAVEL TIPS</p>\\n                        <ul uk-accordion>\\n                                {#each json_faq['tips'] as faq}\\n                                    <li>\\n                                    <a class=\\"uk-accordion-title\\" href=\\"#\\">{faq.title}</a>\\n                                        <div class=\\"uk-accordion-content\\">\\n                                            <p>{@html faq.content}</p>\\n                                        </div>\\n                                    </li>\\n                                    {/each}\\n                        </ul>\\n                    </div>\\n                </div>\\n\\n                <div>\\n                    <div class=\\"uk-tile uk-padding-remove-top uk-margin-remove-top\\">\\n                        <p class=\\"uk-h4\\">THE POLICY OF GHENT UNIVERSITY</p>\\n                        <ul uk-accordion>\\n                                {#each json_faq['policy'] as faq}\\n                                    <li>\\n                                    <a class=\\"uk-accordion-title\\" href=\\"#\\">{faq.title}</a>\\n                                        <div class=\\"uk-accordion-content\\">\\n                                            <p>{@html faq.content}</p>\\n                                        </div>\\n                                    </li>\\n                                    {/each}\\n                        </ul>\\n                    </div>\\n                </div>\\n\\n            </div>\\n\\n\\n    \\n        </div>\\n    </div>\\n\\n<style>\\n\\n.uk-accordion-title{\\ncolor: rgb(61, 61, 61);\\nfont-family: Roboto;\\nfont-weight: 300;\\nfont-size: 14px;\\n}\\n\\n.uk-h4{\\n    color:#94bb9f;\\n    font-weight: 300;\\n    font-size:18px;\\n}\\n\\n.uk-accordion-content{\\n    font-weight: 300;\\n    font-size: small;\\n}\\n</style>"],"names":[],"mappings":"AAqHA,kCAAmB,CAAC,AACpB,KAAK,CAAE,IAAI,EAAE,CAAC,CAAC,EAAE,CAAC,CAAC,EAAE,CAAC,CACtB,WAAW,CAAE,MAAM,CACnB,WAAW,CAAE,GAAG,CAChB,SAAS,CAAE,IAAI,AACf,CAAC,AAED,qBAAM,CAAC,AACH,MAAM,OAAO,CACb,WAAW,CAAE,GAAG,CAChB,UAAU,IAAI,AAClB,CAAC,AAED,oCAAqB,CAAC,AAClB,WAAW,CAAE,GAAG,CAChB,SAAS,CAAE,KAAK,AACpB,CAAC"}`
};
var Faq_en = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div uk-filter="${"target: .filter"}" class="${"uk-width-1-1"}"><div class="${"uk-section uk-margin-small-left uk-margin-small-right uk-padding-small-top"}" style="${"background-color: #F5F5F5;"}"><div class="${"uk-grid-match uk-child-width-1-3@m uk-grid-small  uk-padding-remove-bottom uk-margin-remove-bottom"}" uk-grid><div><div class="${"uk-tile uk-padding-remove-top"}"><p class="${"uk-h4 svelte-1lhvux6"}">ACCESSIBILITY BY TRAIN</p>
                    <ul uk-accordion class="${"filter"}">${each(json_faq["accessibility"], (faq) => `<li class="${"skills-el"}" data-name="${"div 1"}"><a class="${"uk-accordion-title svelte-1lhvux6"}" href="${"#"}">${escape2(faq.title)}</a>
                                    <div class="${"uk-accordion-content svelte-1lhvux6"}"><p><!-- HTML_TAG_START -->${faq.content}<!-- HTML_TAG_END --></p></div>
                                </li>`)}</ul></div></div>
            <div><div class="${"uk-tile uk-padding-remove-top"}"><p class="${"uk-h4 svelte-1lhvux6"}">RESERVATION</p>
                        <ul uk-accordion>${each(json_faq["reservation"], (faq) => `<li><a class="${"uk-accordion-title svelte-1lhvux6"}" href="${"#"}">${escape2(faq.title)}</a>
                                        <div class="${"uk-accordion-content svelte-1lhvux6"}"><p><!-- HTML_TAG_START -->${faq.content}<!-- HTML_TAG_END --></p></div>
                                    </li>`)}</ul></div></div>
    
            <div><div class="${"uk-tile uk-padding-remove-top uk-margin-remove-top"}"><p class="${"uk-h4 svelte-1lhvux6"}">POSSIBLE OBSTACLES</p>
                    <ul uk-accordion>${each(json_faq["obstacles"], (faq) => `<li><a class="${"uk-accordion-title svelte-1lhvux6"}" href="${"#"}">${escape2(faq.title)}</a>
                                    <div class="${"uk-accordion-content svelte-1lhvux6"}"><p><!-- HTML_TAG_START -->${faq.content}<!-- HTML_TAG_END --></p></div>
                                </li>`)}</ul></div></div></div>
    
            <div class="${"uk-grid-match uk-child-width-1-3@m uk-grid-small uk-padding-remove-top uk-margin-remove-top"}" uk-grid><div><div class="${"uk-tile uk-padding-remove-top uk-margin-remove-top"}"><p class="${"uk-h4 svelte-1lhvux6"}">SUSTAINABILITY</p>
                            <ul uk-accordion>${each(json_faq["sustainability"], (faq) => `<li><a class="${"uk-accordion-title svelte-1lhvux6"}" href="${"#"}">${escape2(faq.title)}</a>
                                            <div class="${"uk-accordion-content svelte-1lhvux6"}"><p><!-- HTML_TAG_START -->${faq.content}<!-- HTML_TAG_END --></p></div>
                                        </li>`)}</ul></div></div>
    
                <div><div class="${"uk-tile uk-padding-remove-top uk-margin-remove-top"}"><p class="${"uk-h4 svelte-1lhvux6"}">TRAVEL TIPS</p>
                        <ul uk-accordion>${each(json_faq["tips"], (faq) => `<li><a class="${"uk-accordion-title svelte-1lhvux6"}" href="${"#"}">${escape2(faq.title)}</a>
                                        <div class="${"uk-accordion-content svelte-1lhvux6"}"><p><!-- HTML_TAG_START -->${faq.content}<!-- HTML_TAG_END --></p></div>
                                    </li>`)}</ul></div></div>

                <div><div class="${"uk-tile uk-padding-remove-top uk-margin-remove-top"}"><p class="${"uk-h4 svelte-1lhvux6"}">THE POLICY OF GHENT UNIVERSITY</p>
                        <ul uk-accordion>${each(json_faq["policy"], (faq) => `<li><a class="${"uk-accordion-title svelte-1lhvux6"}" href="${"#"}">${escape2(faq.title)}</a>
                                        <div class="${"uk-accordion-content svelte-1lhvux6"}"><p><!-- HTML_TAG_START -->${faq.content}<!-- HTML_TAG_END --></p></div>
                                    </li>`)}</ul></div></div></div></div>
    </div>`;
});
var faq_en = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Faq_en
});
var prerender$1 = true;
var Faqs = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="${"uk-section"}" style="${"background-color:#C2EDCE"}"><div class="${"uk-container"}"><div class="${"uk-margin"}"><h1 class="${"uk-heading-small uk-text-center uk-text-lighter"}" style="${"color:#5b8a68"}">Frequently asked questions</h1>
            <h4 class="${"uk-margin-remove uk-padding-remove uk-text-center uk-text-lighter"}" style="${"color:#5b8a68"}">If your question cannot be found below, please feel free to contact us.</h4>

           </div></div></div>    
    

${validate_component(Faq_en, "FaqEn").$$render($$result, {}, {}, {})}




`;
});
var faqs = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Faqs,
  prerender: prerender$1
});
var prerender = true;
var Map$1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return ``;
});
var map = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  "default": Map$1,
  prerender
});

// .svelte-kit/netlify/entry.js
init();
async function handler(event) {
  const { path, httpMethod, headers, rawQuery, body, isBase64Encoded } = event;
  const query = new URLSearchParams(rawQuery);
  const type = headers["content-type"];
  const rawBody = type && isContentTypeTextual(type) ? isBase64Encoded ? Buffer.from(body, "base64").toString() : body : new TextEncoder("base64").encode(body);
  const rendered = await render({
    method: httpMethod,
    headers,
    path,
    query,
    rawBody
  });
  if (rendered) {
    return {
      isBase64Encoded: false,
      statusCode: rendered.status,
      ...splitHeaders(rendered.headers),
      body: rendered.body
    };
  }
  return {
    statusCode: 404,
    body: "Not found"
  };
}
function splitHeaders(headers) {
  const h = {};
  const m = {};
  for (const key in headers) {
    const value = headers[key];
    const target = Array.isArray(value) ? m : h;
    target[key] = value;
  }
  return {
    headers: h,
    multiValueHeaders: m
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
